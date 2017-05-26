import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';
import * as moment from 'moment';

import * as choreModel from '../models/choreModel';
import { getHandle } from '../controllers/userController';
import { postMessage } from '../util/slackUtils';

export async function process(client, user, channel: string, args: string[]): Promise<void> {
  const choreId = _.first(args);

  if (!_.includes(choreIds, choreId)) {
    return await postMessage(client, channel, `Sorry, I don't recognize that chore. Valid options are ${JSON.stringify(choreIds)}`);
  }

  const chores = (choreId === 'all') ?
    await choreModel.getAll() :
    [await choreModel.get(choreId)];

  const message = _(chores)
    .compact()
    .map(chore => {
      const user = _.find(DefaultUsers, { _id: chore.turn });
      const lastCompleted = moment(chore.lastFinished).format('MMM D') || 'never';

      return `Please ${_.toLower(chore.description)}, ${getHandle(user)}. (last completed ${lastCompleted})`;
    })
    .join('\n');

  await postMessage(client, channel, message);
}
