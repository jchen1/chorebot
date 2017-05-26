import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';

import * as choreModel from '../models/choreModel';
import { postMessage } from '../util/slackUtils';

export async function process(client, user, channel: string, args: string[]): Promise<void> {
  await postMessage(
    client,
    channel,
    `Available commands:\n
\`finished [dishes|trash|all]\`: mark a task as completed\n
\`remind [dishes|trash|all]\`: remind the owner of a task\n
\`list\`: list tasks and their owners`);
}
