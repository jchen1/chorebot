'use strict';

import * as Joi from 'joi';
import { DefaultUserIds } from '../definitions/Users';

const ChoreSchema = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  turn: Joi.string().required().allow(DefaultUserIds.concat('')),
  lastFinished: Joi.date().timestamp().optional(),
  lastReminded: Joi.date().timestamp().optional()
});

export {
  ChoreSchema
};
