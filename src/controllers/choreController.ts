'use strict';

import * as _ from 'lodash';

import { Chores } from '../definitions/Chores';
import { chores } from '../models/choreModel';

function init(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chores.insertMany(_.map(Chores, _.identity), {}, (err, res) => {
      if (err && err.code !== 11000) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export {
  init
};
