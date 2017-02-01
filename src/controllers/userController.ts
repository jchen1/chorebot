import * as _ from 'lodash';

import { DefaultUsers, DefaultUserIds } from '../definitions/Users';
import * as userModel from '../models/userModel';

function getNextUser(id) {
  const nextId = (_.findIndex(DefaultUserIds, _.partial(_.isEqual, id)) + 1) % _.size(DefaultUserIds);
  return DefaultUserIds[nextId] as string;
}

async function init(): Promise<void> {
  const userColl = await userModel.get();
  userColl.insertMany(_.map(DefaultUsers, _.identity))
    .catch(err => { if (err.code !== 11000) throw err; });
}

export {
  getNextUser,
  init
};
