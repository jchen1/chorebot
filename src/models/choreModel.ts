import { Collection } from 'mongodb';
import { Chore } from '../types/Chore';

import * as _ from 'lodash';

import { db } from '../db';

const COLLECTION_NAME = 'chores';

async function init(): Promise<Collection> {
  return (await db).collection(COLLECTION_NAME);
}

async function get(id): Promise<Chore> {
  const coll = await init();
  const chore = _.first(await coll.find({ _id: id }).toArray());
  if (!chore) {
    throw new Error('not found');
  }
  return chore;
}

async function getAll(): Promise<Chore[]> {
  const coll = await init();
  return coll.find().toArray();
}

export {
  init,
  get,
  getAll
};
