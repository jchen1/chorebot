'use strict';

import * as _ from 'lodash';

const Chores = Object.freeze({
  DISHES: {
    _id: 'dishes',
    name: 'Dishes',
    description: 'Wash and put away the dishes',
    turn: ''
  },
  TRASH: {
    _id: 'trash',
    name: 'Trash',
    description: 'Take out the trash and boxes',
    turn: ''
  }
});

export {
  Chores
};
