export interface ITodo {
  _id: string;
  name: string;
  status: boolean;
  addedDate: Date;
}

export type NewTodo = Omit<ITodo, 'id'> & { _id: null };
