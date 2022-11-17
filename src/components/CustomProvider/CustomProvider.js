import React from 'react';
import {GetTodoListContext, SetTodoListContext} from "../../context/TodoListContext";
import {GetCurrentTodoItemContext, SetCurrentTodoItemContext} from "../../context/CurrentTodoItemContext";
import {todoItemsList} from "../../utils/constants/todoItemsList";

export default function CustomProvider({children}) {
  const [todoList, setTodoList] = React.useState(todoItemsList);
  const [currentTodoItem, setCurrentTodoItem] = React.useState(null);

  return (
    <GetTodoListContext.Provider value={todoList}>
      <SetTodoListContext.Provider value={setTodoList}>
        <GetCurrentTodoItemContext.Provider value={currentTodoItem}>
          <SetCurrentTodoItemContext.Provider value={setCurrentTodoItem}>
            {children}
          </SetCurrentTodoItemContext.Provider>
        </GetCurrentTodoItemContext.Provider>
      </SetTodoListContext.Provider>
    </GetTodoListContext.Provider>
  )
}