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

  /**
   * функция проверяет статус задачи (выполнена/завершена или нет)
   * @param {Object} todoItem объект с данными задачи
   * @return {Boolean} логический результат проверки
   */
  function checkFinishedTodo(todoItem) {
    return dayjs() > dayjs(todoItem.date) || todoItem.isChecked;
  }

  /**
   * функция ищет задачу в todo-лист по id
   * @param {String} id идентификатор элемента в DOM
   * @return {Object} объект с данными задачи
   */
  function findTodoByElementId(id) {
    const currentTodoId = +id.split('-')[1];
    return todoList.find(item => item.id === currentTodoId);
  }

  /**
   * функция обрабатывает клик по элементу todo-листа
   * @param {Object} e событие в DOM
   * @return {VoidFunction} записывает элемент в стейт выбранной задачи
   */
  function handleTodoClick(e) {
    const currentTodo = findTodoByElementId(e.currentTarget.id);

    setCurrentTodo(currentTodo);
  }

  /**
   * функция обрабатывает клик по кнопке удаления элемента todo-листа
   * @param {Object} e событие в DOM
   * @return {VoidFunction} удаляет элемент из todo-лист
   */
  function handleDeleteTodoClick(e) {
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
          key={`tr-${todo.id}`}
          id={'cell-' + todo.id}
          onClick={handleTodoClick}
          className={`table__body-row + ${currentTodo?.id === todo.id ? 'table__body-row_active' : ''}`}
        >
          <td className="table__cell table__cell_content_check">
            {(checkFinishedTodo(todo)) && <div className="table__checked"></div>}
            <button
              type="button"
              id={'delete-' + todo.id}
              onClick={handleDeleteTodoClick}
              className="table__delete"
              aria-label="delete todo"
            />
          </td>
          <td className="table__cell">{todo.title}</td>
          <td className="table__cell">
            {todo.description}
          </td>
          <td className="table__cell">
            {dayjs(todo.dateFinish).format('DD.MM.YYYY')}
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