import { Collection } from 'mongodb';

import * as async from 'async';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { db } from '../db';

const COLLECTION_NAME = 'users';

async function get(): Promise<Collection> {
  return (await db).collection(COLLECTION_NAME);
}

export {
  get
};
