import * as _ from 'lodash';

const DefaultUsers = Object.freeze({
  ARJUN: {
    _id: 'U3X7JSU23',
    name: 'Arjun Rao',
    username: 'arjun',
    dm: 'D3Y428C8L'
  },
  JEFF: {
    _id: 'U3VS17UQZ',
    name: 'Jeff Chen',
    username: 'jeff',
    dm: 'D3Y428C5S'
  },
  TIM: {
    _id: 'U3WHX599Q',
    name: 'Tim Hyon',
    username: 'tim',
    dm: 'D3Y428CBW'
  }
});

const DefaultUserIds = _.map(DefaultUsers, '_id');

export {
  DefaultUsers,
  DefaultUserIds
};
