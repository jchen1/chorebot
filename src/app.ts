'use strict';

import * as _ from 'lodash';

const { RtmClient, CLIENT_EVENTS } = require('@slack/client');
const { SLACK_API_TOKEN } = require('../keys.json');

const rtm = new RtmClient(SLACK_API_TOKEN);

const channel = 'C3XV8HRNX';

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, data => {
  console.log(`Logged in as ${data.self.name} of team ${data.team.name}, but not yet connected`);
  console.log(data);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log(`Connected!!!`);
  rtm.sendMessage('test', channel);
});

rtm.start();
