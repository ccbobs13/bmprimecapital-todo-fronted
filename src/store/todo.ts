import {defineStore} from "pinia";
import axios from "axios";
import {ITodo} from "@/models/todo.model";

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as ITodo[],
  }),
  getters: {
    getTodoById: (state) => (id: string) => {
      return state.todos.find((todo) => todo._id === id);
    },
    getTodoByStatus: (state) => (status: boolean) => {
      return state.todos.find((todo) => todo.status === status);
    }
  },
  actions: {
    async fetchTodos() {
      const response = await axios.get("http://localhost:3000/todos");
      this.todos = response.data;
    },
    addTodo(name: string) {
      if (name !== '') {
        const newTodo = {
          name,
          status: false,
          addedDate: new Date()
        };
        axios
          .post("http://localhost:3000/todos", newTodo)
          .then((response) => {
            this.todos.push(response.data);
          });
      }
    },
    updateTodoStatus(id: string, status: boolean) {
      const todoToUpdate = this.getTodoById(id);
      if (todoToUpdate) {
        todoToUpdate.status = status;
        axios
          .put(`http://localhost:3000/todos/${id}`, todoToUpdate)
          .then(() => {
            this.fetchTodos().then();
          });
      }
    },
    updateTodo(id: string, name: string) {
      const todoToUpdate = this.getTodoById(id);
      if (todoToUpdate) {
        todoToUpdate.name = name;
        axios
          .put(`http://localhost:3000/todos/${id}`, todoToUpdate)
          .then(() => {
            this.fetchTodos().then();
          });
      }
    },
    clearTodos() {
      this.todos = this.todos.filter((todo) => todo.status == true)
    },
    async filterByStatus(status: boolean) {
      await this.fetchTodos();
      this.todos = this.todos.filter((todo) => todo.status == status)
    },
    removeTodo(id: string) {
      axios.delete(`http://localhost:3000/todos/${id}`).then(() => {
        this.todos = this.todos.filter((todo) => todo._id !== id);
      });
    },
  }
})
