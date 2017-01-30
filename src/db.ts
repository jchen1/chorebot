'use strict';

// import { Db, Server, MongoClient } from 'mongodb';
import * as mongoskin from 'mongoskin';

const db = mongoskin.db('mongodb://localhost:27017/chorebot');

export {
  db
};
