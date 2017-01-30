'use strict';

import * as _ from 'lodash';

import { Chores } from '../definitions/Chores';
import { chores } from '../models/choreModel';

function init(cb) {
  chores.insertMany(_.map(Chores, _.identity), {}, (err, res) => {
    if (err && err.code === 11000) {
      return cb(null, res);
    }
    cb(err, res);
  });
}

export {
  init
};
