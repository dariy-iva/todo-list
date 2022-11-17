import React from 'react';
import './TodoList.less'
import {GetTodoListContext, SetTodoListContext} from "../../context/TodoListContext";
import {GetCurrentTodoItemContext, SetCurrentTodoItemContext} from "../../context/CurrentTodoItemContext";
import dayjs from "dayjs";

export default function TodoList() {
  const todoList = React.useContext(GetTodoListContext);
  const setTodoList = React.useContext(SetTodoListContext);
  const currentTodo = React.useContext(GetCurrentTodoItemContext);
  const setCurrentTodo = React.useContext(SetCurrentTodoItemContext);

  function checkFinishedTodo(todoItem) {
    return dayjs() > dayjs(todoItem.date) || todoItem.isChecked;
  }

  function findTodoByElementId(id) {
    const currentTodoId = +id.split('-')[1];
    return todoList.find(item => item.id === currentTodoId);
  }

  function handleTodoClick(e) {
    const currentTodo = findTodoByElementId(e.currentTarget.id);

    setCurrentTodo(currentTodo);
  }

  function deleteTodo(e) {
    e.stopPropagation();

    const deletedTodo = findTodoByElementId(e.currentTarget.id);
    const newTodoList = todoList.filter(item => item.id !== deletedTodo.id);

    if (currentTodo?.id === deletedTodo.id) {
      setCurrentTodo(null);
    }

    setTodoList(newTodoList);
  }

  return (
    <table className="table">
      <thead>
      <tr>
        <th className="table__cell table__cell_content_check"></th>
        <th className="table__cell table__cell_content_title">Задача</th>
        <th className="table__cell table__cell_content_description">Описание</th>
        <th className="table__cell table__cell_content_date">Срок завершения</th>
        <th className="table__cell table__cell_content_files">Файлы</th>
      </tr>
      </thead>
      <tbody>
      {todoList.map((todo) => (
        <tr
          key={todo.id}
          id={'cell-' + todo.id}
          onClick={handleTodoClick}
          className={`table__body-row + ${currentTodo?.id === todo.id ? 'table__body-row_active' : ''}`}
        >
          <td className="table__cell table__cell_content_check">
            {(checkFinishedTodo(todo)) && <div className="table__checked"></div>}
            <button
              type="button"
              id={'delete-' + todo.id}
              onClick={deleteTodo}
              className="table__delete"
              aria-label="delete todo"
            />
          </td>
          <td className="table__cell">{todo.title}</td>
          <td className="table__cell">
            {todo.description}
          </td>
          <td className="table__cell">
            {todo.dateFinish.toString()}
          </td>
          <td className="table__cell">
            <ul className="table__files">
              {todo.files.map((file) => (
                <li key={file.name}>
                  {file.name}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}