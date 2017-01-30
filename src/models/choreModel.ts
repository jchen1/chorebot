'use strict';

import * as async from 'async';
import * as Joi from 'joi';
import * as _ from 'lodash';

import { db } from '../db';

const COLLECTION_NAME = 'chores';
const collection = db.collection(COLLECTION_NAME);

export {
  collection as chores
};
