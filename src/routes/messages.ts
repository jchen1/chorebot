import * as _ from 'lodash';
import * as async from 'async';
import * as moment from 'moment';
const { RTM_EVENTS, RTM_MESSAGE_SUBTYPES, WebClient } = require('@slack/client');

import * as commands from '../commands';
import * as config from '../config';

import { DefaultUsers } from '../definitions/Users';

import * as choreModel from '../models/choreModel';

import * as choreController from '../controllers/choreController';
import * as userController from '../controllers/userController';

const client = new WebClient(config.SLACK_API_TOKEN);

const IGNORED_MESSAGE_TYPES = [RTM_MESSAGE_SUBTYPES.BOT_MESSAGE, RTM_MESSAGE_SUBTYPES.CHANNEL_TOPIC];

const handlers = {
  [RTM_EVENTS.MESSAGE]: async message => {
    if (_.includes(IGNORED_MESSAGE_TYPES, message.subtype)) return;
    const channelId = message.channel;
    const user = _.find(DefaultUsers, { _id: message.user });
    const [command, ...args] = _.split(_.toLower(message.text), ' ');

    commands.processCommand(client, user, channelId, command, args);
  }
};

export {
  handlers
};
