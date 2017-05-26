import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';
import * as moment from 'moment';

import * as choreModel from '../models/choreModel';
import { getHandle } from '../controllers/userController';

export async function process(client, channel: string, args: string[]): Promise<void> {
  const chores = await choreModel.getAll();

  const message = _(chores)
    .compact()
    .map(chore => {
      const user = _.find(DefaultUsers, { _id: chore.turn });
      const lastCompleted = moment(chore.lastFinished).format('MMM D') || 'never';
      return `${user.name} is responsible for ${_.lowerCase(chore.name)}. (last completed ${lastCompleted}).`;
    })
    .join('\n');

  await client.chat.postMessage(channel, message);
}
