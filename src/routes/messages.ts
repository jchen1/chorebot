import * as _ from 'lodash';
import * as async from 'async';
import * as moment from 'moment';
const { RTM_EVENTS, RTM_MESSAGE_SUBTYPES, WebClient } = require('@slack/client');

import * as config from '../config';

import { DefaultUsers } from '../definitions/Users';

import * as choreModel from '../models/choreModel';

import * as choreController from '../controllers/choreController';
import * as userController from '../controllers/userController';

const client = new WebClient(config.SLACK_API_TOKEN);

async function unknownMessage(channel) {
  if (channel !== config.channel.id) {
    await client.chat.postMessage(channel, 'Sorry, I didn\'t get that.');
  }
}

const handlers = {
  [RTM_EVENTS.MESSAGE]: async message => {
    if (message.subtype && message.subtype === RTM_MESSAGE_SUBTYPES.BOT_MESSAGE) return;
    const channelId = message.channel;
    const [command, ...args] = _.split(message.text, ' ');
    const choreId = _.first(args);

    switch (command) {
      case 'finished':
        if (!_.includes(['dishes', 'trash', 'all'], choreId)) {
          await client.chat.postMessage(message.channel, 'Sorry, I didn\'t get that.');
        }
        if (choreId === 'all') {
          const nextChores = await choreController.completeAll();
          const text = _.join(_.map(_.compact(nextChores), chore => {
            const user = _.find(DefaultUsers, { _id: chore.turn });
            return `<@${user._id}> is now responsible for ${_.lowerCase(chore.name)} (last completed ${moment(chore.lastFinished).toString()})`;
          }), '\n');
          await client.chat.postMessage(message.channel, text);
        } else {
          const nextChore = await choreController.complete(choreId);
          const user = _.find(DefaultUsers, { _id: nextChore.turn });
          const text = `<@${user._id}> is now responsible for ${_.lowerCase(nextChore.name)} (last completed ${moment(nextChore.lastFinished).toString()})`;
          await client.chat.postMessage(message.channel, text);
        }
        break;
      case 'remind':
        if (!_.includes(['dishes', 'trash', 'all'], choreId)) {
          await client.chat.postMessage(message.channel, 'Sorry, I didn\'t get that.');
        }
        if (choreId === 'all') {
          const chores = await choreModel.getAll();
          await Promise.all(_.map(chores, async chore => {
            const user = _.find(DefaultUsers, { _id: chore.turn });
            await client.chat.postMessage(config.channel.id, `<@${user._id}> do the ${_.lowerCase(chore.name)}`);
          }));
        } else {
          const chore = await choreModel.get(choreId);
          const user = _.find(DefaultUsers, { _id: chore.turn });
          await client.chat.postMessage(config.channel.id, `<@${user._id}> do the ${_.lowerCase(chore.name)}`);
        }
        break;
      case 'list':
        const chores = await choreModel.getAll();
        const text = _.join(_.map(chores, chore => {
          const nextUser = _.find(DefaultUsers, { _id: (chore as any).turn });
          return `${nextUser.name} is responsible for ${_.lowerCase((chore as any).name)} (last completed ${moment((chore as any).lastFinished).toString() || 'never'})`;
        }), '\n');
        await client.chat.postMessage(message.channel, text);
        break;
      case 'help':
        await client.chat.postMessage(
          message.channel,
          `Available commands:\n
\`finished [dishes|trash|all]\`: mark a task as completed\n
\`remind [dishes|trash|all]\`: remind the owner of a task\n
\`list\`: list tasks and their owners`);
        break;
      default:
        await unknownMessage(message.channel);
        break;
    }
  }
};

export {
  handlers
};
