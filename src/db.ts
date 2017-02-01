'use strict';

import * as mongoskin from 'mongoskin';

const db = mongoskin.db('mongodb://localhost:27017/chorebot');

export {
  db
};
