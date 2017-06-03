import * as _ from 'lodash';

import * as config from './config';

import * as choreController from './controllers/choreController';
import * as userController from './controllers/userController';

const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
import { SLACK_API_TOKEN } from './config';

interface Channel {
  id: string;
  is_member: boolean;
  name: string;
}

const rtm = new RtmClient(SLACK_API_TOKEN);

const routes = [
  'messages'
];

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Slack connection up...');
});

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ channels }) => {
  const channel = _.find<Channel>(channels, { name: config.CHORES_CHANNEL });
  if (!channel || !channel.is_member) {
    console.error('error initializing: Couldn\'t find appropriate channel!');
    process.exit(1);
  }

  config.setChannelId(channel.id);
});

function initRoutes() {
  _.each(routes, route => {
    const handlers = require(`./routes/${route}`).handlers;
    _.each(handlers, (handler, event) => {
      rtm.on(event, handler);
    });
  });
}

(async function() {
  try {
    process.on('unhandledRejection', r => console.log(r));

    await choreController.init();
    await userController.init();
    initRoutes();
    rtm.start();
  } catch (err) {
    console.error(`error initializing: ${err}`);
    process.exit(1);
  }
})();

