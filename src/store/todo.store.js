import { Todo } from '../todos/models/todo.models';

export const Filters = {
  All: 'all',
  Completed: 'Completed',
  Pending: 'Pending',
};

const state = {
  todos: [],
  filter: Filters.All,
};

//Funcionalidades
const initStore = () => {
  loadStore();
};

const loadStore = () => {
  if (!localStorage.getItem('state')) return;
  const { todos, filter } = JSON.parse(localStorage.getItem('state'));
  state.todos = todos;
  state.filter = filter;
};

const saveStateToLocalStorge = () => {
  state.todos.forEach((todo) => {
    localStorage.setItem('state', JSON.stringify(state));
  });
};

const getTodos = (filter = Filters.All) => {
  switch (filter) {
    case Filters.All:
      return [...state.todos];
    case Filters.Completed:
      return state.todos.filter((todo) => todo.done);
    case Filters.Pending:
      return state.todos.filter((todo) => !todo.done);
    default:
      throw new Error(`Option ${filter} is not valid`);
  }
};

/**
 *
 * @param {String} description
 */
const addTodo = (description) => {
  if (!description) throw new Error('Description is required');
  state.todos.push(new Todo(description));
  saveStateToLocalStorge();
};

const toggleTodo = (todoId) => {
  state.todos = state.todos.map((todo) => {
    if (todo.id === todoId) {
      todo.done = !todo.done;
    }
    return todo;
  });
  saveStateToLocalStorge();
};

const deleteTodo = (todoId) => {
  state.todos = state.todos.filter((todo) => todo.id !== todoId);
  saveStateToLocalStorge();
};

const deleteCompleted = () => {
  state.todos = state.todos.filter((todo) => !todo.done);
  saveStateToLocalStorge();
};

/**
 * @param {Filters} newFilter
 */
const setFilter = (newFilter = Filters.All) => {
  state.filter = newFilter;
  saveStateToLocalStorge();
};

const getCurrentFilter = () => {
  return state.filter;
};

export default {
  addTodo,
  initStore,
  getTodos,
  loadStore,
  setFilter,
  toggleTodo,
  getCurrentFilter,
  deleteTodo,
  deleteCompleted,
  Filters,
};
