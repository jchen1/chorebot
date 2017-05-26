const { SLACK_API_TOKEN } = require('../keys.json');
const NODE_ENV = process.env.NODE_ENV || 'dev';

const IS_PROD = (NODE_ENV === 'production');

const CHORES_CHANNEL = IS_PROD ? { name: 'chorebot', id: 'C3WGRM45Q' } : { name: 'chorebot-test', id: 'C3WGRM45Q' };

export {
  CHORES_CHANNEL,
  SLACK_API_TOKEN,
  NODE_ENV,
  IS_PROD
};
