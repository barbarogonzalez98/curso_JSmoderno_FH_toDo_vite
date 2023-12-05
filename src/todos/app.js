import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos } from './use-cases';

const ElementIds = {
  TodoList: '.todo-list',
  NewTodoInput: '#new-todo-input',
  ClearCompleted: '.clear-completed',
  TodoFilters: '.filtro',
  TodoCount: '#pending-count',
};

/**
 *
 * @param {String} elementId
 */
export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(ElementIds.TodoList, todos);

    //Contador de todos pendientes
    const CountPendings = document.querySelector(ElementIds.TodoCount);
    CountPendings.innerHTML = String(
      todoStore.getTodos(Filters.Pending).length
    );
  };

  //Cuando se llama la funcion app
  (() => {
    const app = document.createElement('div');
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //Referencias HTML
  const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
  const todoListUL = document.querySelector(ElementIds.TodoList);
  const buttonClearCompleted = document.querySelector(
    ElementIds.ClearCompleted
  );
  const filtersLis = document.querySelectorAll(ElementIds.TodoFilters);

  //Listeners
  //Nueva descripcion de todo
  newDescriptionInput.addEventListener('keyup', (event) => {
    if (event.keyCode != 13) return;
    if (event.target.value.trim().length === 0) return;
    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = '';
  });
  //Marcar/desmarcar todo completado
  todoListUL.addEventListener('click', (event) => {
    const element = event.target.closest('[data-id]');
    todoStore.toggleTodo(element.getAttribute('data-id'));
    displayTodos();
  });
  //Eliminar un todo
  todoListUL.addEventListener('click', (event) => {
    const element = event.target.closest('[data-id]');
    if (event.target.className === 'destroy') {
      todoStore.deleteTodo(element.getAttribute('data-id'));
    }
    displayTodos();
  });
  //Borrar completados
  buttonClearCompleted.addEventListener('click', () => {
    todoStore.deleteCompleted();
    displayTodos();
  });
  //Cambiar filtro de tareas
  filtersLis.forEach((element) => {
    element.addEventListener('click', (element) => {
      filtersLis.forEach((e) => e.classList.remove('selected'));
      element.target.classList.add('selected');
      switch (element.target.text) {
        case 'Todos':
          todoStore.setFilter(Filters.All);
          break;
        case 'Completados':
          todoStore.setFilter(Filters.Completed);
          break;
        case 'Pendientes':
          todoStore.setFilter(Filters.Pending);
          break;
      }
      displayTodos();
    });
  });
};
