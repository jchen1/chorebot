import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';
import * as moment from 'moment';

import * as choreModel from '../models/choreModel';

import * as choreController from '../controllers/choreController';
import { getHandle } from '../controllers/userController';

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

export async function process(client, channel: string, args: string[]): Promise<void> {
  const choreId = _.first(args);

  if (!_.includes(choreIds, choreId)) {
    return await client.chat.postMessage(channel, `Sorry, I don't recognize that chore. Valid options are ${JSON.stringify(choreIds)}`);
  }

  const nextChores = (choreId === 'all') ?
    await choreController.completeAll() :
    [await choreController.complete(choreId)];

  const message = _(nextChores)
    .compact()
    .map(chore => {
      const user = _.find(DefaultUsers, { _id: chore.turn });
      return `${getHandle(user)} is now responsible for ${_.lowerCase(chore.name)}.`;
    })
    .join('\n');

  await client.chat.postMessage(channel, message);
  await setTopic(client, channel);
}
