import * as _ from 'lodash';

import { DefaultChores } from '../definitions/Chores';
import * as choreModel from '../models/choreModel';
import * as userController from './userController';
import { Chore } from '../types/Chore';

async function init(): Promise<void> {
  const choreColl = await choreModel.init();
  choreColl.insertMany(_.map(DefaultChores, _.identity))
    .catch(err => { if (err.code !== 11000) throw err; });
}

async function complete(choreId: string): Promise<Chore> {
  const choreColl = await choreModel.init();
  const chore = await choreModel.get(choreId);
  const updateObj = await choreColl.findOneAndUpdate({ _id: chore._id }, {
    $set: {
      lastFinished: Date.now(),
      turn: userController.getNextUser(chore.turn)
    }
  }, { returnOriginal: false });
  return updateObj.value;
}

async function completeAll(): Promise<Chore[]> {
  const choreColl = await choreModel.init();
  const originalChores = await choreModel.getAll();

  const newChores: Chore[] = _.map(originalChores, chore => _.extend({}, chore, {
    lastFinished: Date.now(),
    turn: userController.getNextUser(chore.turn)
  }));

  const bulkUpdateOps = _.map(newChores, chore => ({
    updateOne: {
      filter: { _id: chore._id },
      update: {
        $set: {
          lastFinished: chore.lastFinished,
          turn: chore.turn
        }
      }
    }
  }));

  const updateObj = await choreColl.bulkWrite(bulkUpdateOps);
  return newChores;
}

export {
  init,
  complete,
  completeAll
};
