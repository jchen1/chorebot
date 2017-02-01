import * as _ from 'lodash';
import * as async from 'async';

import * as choreController from './controllers/choreController';
import * as userController from './controllers/userController';

const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
import { SLACK_API_TOKEN } from './config';

const rtm = new RtmClient(SLACK_API_TOKEN);

const routes = [
  'messages'
];

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Slack connection up...');
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
    await choreController.init();
    await userController.init();
    initRoutes();
    rtm.start();
  } catch (err) {
    console.error(`error initializing: ${err}`);
    process.exit(1);
  }
})();

