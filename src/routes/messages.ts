'use strict';

import * as _ from 'lodash';
import * as async from 'async';
import * as moment from 'moment';
const { RTM_EVENTS, RTM_MESSAGE_SUBTYPES, WebClient } = require('@slack/client');

import * as config from '../config';

import { chores } from '../models/choreModel';
import { DefaultUsers } from '../definitions/Users';

import * as userController from '../controllers/userController';

const client = new WebClient(config.SLACK_API_TOKEN);

function unknownMessage(channel) {
  if (channel !== config.channel.id) {
    return client.chat.postMessage(channel, 'Sorry, I didn\'t get that.', _.noop);
  }
}

const handlers = {
  [RTM_EVENTS.MESSAGE]: message => {
    if (message.subtype && message.subtype === RTM_MESSAGE_SUBTYPES.BOT_MESSAGE) return;
    const channelId = message.channel;
    const [command, ...args] = _.split(message.text, ' ');

    switch (command) {
      case 'finished':
        if (!_.includes(['dishes', 'trash', 'all'], _.first(args))) {
          return client.chat.postMessage(message.channel, 'Sorry, I didn\'t get that.', _.noop);
        }
        async.waterfall([
          cb => chores.find().toArray(cb),
          (choreVals, cb) => async.map(choreVals, (chore, cb) => {
            if ((chore as any).turn !== message.user || (_.first(args) !== (chore as any)._id && _.first(args) !== 'all')) {
              return cb(null, null);
            }
            chores.findOneAndUpdate({ _id: (chore as any)._id }, {
              $set: {
                lastFinished: Date.now(),
                turn: userController.getNextUser((chore as any).turn)
              }
            }, { returnOriginal: false }, cb);
          }, cb),
          (nextChores, cb) => {
            const text = _.join(_.map(_.compact(nextChores), obj => {
              const chore = (obj as any).value;
              const nextUser = _.find(DefaultUsers, { _id: userController.getNextUser(chore.turn) });
              return `<@${nextUser._id}> is now responsible for ${_.lowerCase(chore.name)} (last completed ${moment(chore.lastFinished).toString() || 'never'})`;
            }), '\n');
            async.parallel([
              cb => client.chat.postMessage(message.channel, text || 'No you didn\'t', cb),
              cb => {
                if (text && message.channel !== config.channel.id) return client.chat.postMessage(config.channel.id, text, cb);
                cb();
              }
            ], cb);
          }
        ], _.noop);
        break;
      case 'remind':
        if (!_.includes(['dishes', 'trash', 'all'], _.first(args))) {
          return client.chat.postMessage(message.channel, 'Sorry, I didn\'t get that.', _.noop);
        }
        async.waterfall([
          cb => chores.find().toArray(cb),
          (choreVals, cb) => async.map(choreVals, (chore, cb) => {
            if (_.first(args) !== (chore as any)._id && _.first(args) !== 'all') {
              return cb(null, null);
            }
            cb(null, { chore, user: _.find(DefaultUsers, { _id: (chore as any).turn }) });
          }, cb),
          (res, cb) => async.each(res, ({ chore, user }, cb) => {
            if (user) return client.chat.postMessage(config.channel.id, `<@${user._id}> do the ${_.lowerCase(chore.name)}`, cb);
            cb();
          }, cb)
        ], _.noop);
        break;
      case 'list':
        async.waterfall([
          cb => chores.find({}, { name: 1, turn: 1, lastFinished: 1 }).toArray(cb),
          (choreVals, cb) => {
            const text = _.join(_.map(choreVals, chore => {
              const nextUser = _.find(DefaultUsers, { _id: (chore as any).turn });
              return `${nextUser.name} is responsible for ${_.lowerCase((chore as any).name)} (last completed ${moment((chore as any).lastFinished).toString() || 'never'})`;
            }), '\n');
            client.chat.postMessage(message.channel, text, cb);
          }
        ], _.noop);
        break;
      case 'help':
        client.chat.postMessage(
          message.channel,
          `Available commands:\n
\`finished [dishes|trash|all]\`: mark a task as completed\n
\`remind [dishes|trash|all]\`: remind the owner of a task\n
\`list\`: list tasks and their owners`,
          _.noop);
        break;
      default:
        unknownMessage(message.channel);
        break;
    }
  }
};

export {
  handlers
};
