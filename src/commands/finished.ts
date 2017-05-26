import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';
import * as moment from 'moment';

import * as choreController from '../controllers/choreController';
import * as choreModel from '../models/choreModel';
import { getHandle } from '../controllers/userController';
import { postMessage } from '../util/slackUtils';

async function setTopic(client, channel: string) {
  const chores = await choreModel.getAll();

  const topic = _(chores)
    .compact()
    .map(chore => {
      const user = _.find(DefaultUsers, { _id: chore.turn });
      const lastCompleted = moment(chore.lastFinished).format('MMM D') || 'never';
      return `${_.toLower(chore.name)}: @${user.username}`;
    })
    .join(' | ');

  await client.channels.setTopic(channel, topic);
}

export async function process(client, user, channel: string, args: string[]): Promise<void> {
  const choreId = _.first(args);

  if (!_.includes(choreIds, choreId)) {
    return await postMessage(client, channel, `Sorry, I don't recognize that chore. Valid options are ${JSON.stringify(choreIds)}`);
  }

  try {
    const nextChores = (choreId === 'all') ?
      await choreController.completeAll(user._id) :
      [await choreController.complete(user._id, choreId)];

    const message = _(nextChores)
      .compact()
      .map(chore => {
        const user = _.find(DefaultUsers, { _id: chore.turn });
        return `${getHandle(user)} is now responsible for ${_.lowerCase(chore.name)}.`;
      })
      .join('\n');

    await postMessage(client, channel, message);
    await setTopic(client, channel);
  } catch (e) {
    if (_.endsWith(e.message, 'not assigned to this chore!')) {
      return await postMessage(client, channel, `You aren't assigned to chore '${choreId}.'`);
    }

    throw e;
  }
}
