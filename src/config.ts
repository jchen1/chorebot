const { SLACK_API_TOKEN } = require('../keys.json');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const IS_PROD = (NODE_ENV === 'production');
const CHORES_CHANNEL = IS_PROD ? 'chores' : 'chorebot-test';

let channelId = '';

function setChannelId(id: string) {
  channelId = id;
}

function getChannelId() {
  return channelId;
}

export {
  CHORES_CHANNEL,
  SLACK_API_TOKEN,
  NODE_ENV,
  IS_PROD,
  getChannelId,
  setChannelId
};
