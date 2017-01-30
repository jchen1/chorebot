'use strict';

import * as _ from 'lodash';

import { DefaultUsers, DefaultUserIds } from '../definitions/Users';
import { users } from '../models/userModel';

function getNextUser(id) {
  const nextId = (_.findIndex(DefaultUserIds, _.partial(_.isEqual, id)) + 1) % _.size(DefaultUserIds);
  return DefaultUserIds[nextId] as string;
}

function init(cb) {
  users.insertMany(_.map(DefaultUsers, _.identity), {}, (err, res) => {
    if (err && err.code === 11000) {
      return cb(null, res);
    }
    cb(err, res);
  });
}

export {
  getNextUser,
  init
};
