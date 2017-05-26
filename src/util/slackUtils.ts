import * as _ from 'lodash';

export async function postMessage(client, channel: string, message: string, opts = {}) {
  await client.chat.postMessage(channel, message, _.defaults(opts, { as_user: true }));
}
