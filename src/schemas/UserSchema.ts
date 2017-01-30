'use strict';

import * as Joi from 'joi';
import { DefaultUserIds } from '../definitions/Users';

const UserSchema = Joi.object().keys({
  _id: Joi.string().required().allow(DefaultUserIds),
  name: Joi.string().required(),
  username: Joi.string().required()
});

export {
  UserSchema
};
