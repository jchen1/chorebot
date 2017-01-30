'use strict';

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

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(rtmStartData);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Slack connection up...');
});

function initRoutes(cb) {
  _.each(routes, route => {
    const handlers = require(`./routes/${route}`).handlers;
    _.each(handlers, (handler, event) => {
      rtm.on(event, handler);
    });
  });
  cb();
}

async.parallel([
  cb => choreController.init(cb),
  cb => userController.init(cb),
  cb => initRoutes(cb)
], err => {
  if (err) console.log(`error initializing: ${err}`);
  rtm.start();
});

