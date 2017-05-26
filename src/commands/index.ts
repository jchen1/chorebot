import * as _ from 'lodash';

import * as config from '../config';

import * as finished from './finished';
import * as help from './help';
import * as list from './list';
import * as remind from './remind';

const commands = {
  finished,
  help,
  list,
  remind
};

export async function processCommand(client, channel, command, args) {
  if (_.has(commands, command)) {
    await commands[command].process(client, channel, args);
  }
}
