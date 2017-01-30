'use strict';

import * as _ from 'lodash';

function ensureIndexes(collection, indexes) {
  _.each(indexes, indexArgs => {
    const cb = function(err) {
      if (err) console.log(err);
    };
    const callArgs = [].concat(indexArgs, cb);
    collection.ensureIndex.apply(collection, callArgs);
  });
}

export {
  ensureIndexes
};
