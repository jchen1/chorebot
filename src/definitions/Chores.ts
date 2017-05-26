import * as _ from 'lodash';

const DefaultChores = Object.freeze({
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

const choreIds = _.concat(_.map<{ Chore }, string>(DefaultChores, '_id'), 'all');

export {
  DefaultChores,
  choreIds
};
