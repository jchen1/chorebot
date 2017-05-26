import { Chore } from '../types/Chore';

import { DefaultChores, choreIds } from '../definitions/Chores';
import { DefaultUsers } from '../definitions/Users';

import * as _ from 'lodash';

import * as choreModel from '../models/choreModel';

export async function process(client, channel: string, args: string[]): Promise<void> {
  await client.chat.postMessage(
    channel,
    `Available commands:\n
\`finished [dishes|trash|all]\`: mark a task as completed\n
\`remind [dishes|trash|all]\`: remind the owner of a task\n
\`list\`: list tasks and their owners`);
}
