import { MongoClient, Server } from 'mongodb';

const db = new MongoClient().connect('mongodb://localhost:27017/chorebot');

export {
  db
};
