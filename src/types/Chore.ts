export interface Chore {
  _id: string;
  name: string;
  description: string;
  turn: string;
  lastFinished?: number;
  lastReminded?: number;
}
