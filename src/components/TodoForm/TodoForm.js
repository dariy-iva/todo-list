import React from 'react';
import dayjs from "dayjs";
import './TodoForm.less';
import '../../less/layout.less';
import {GetCurrentTodoItemContext, SetCurrentTodoItemContext} from "../../context/CurrentTodoItemContext";
import {GetTodoListContext, SetTodoListContext} from "../../context/TodoListContext";
import useFormValidator from "../../hooks/useFormValidator";

export default function TodoForm() {
  const currentTodoItem = React.useContext(GetCurrentTodoItemContext);
  const setCurrentTodoItem = React.useContext(SetCurrentTodoItemContext);
  const todoList = React.useContext(GetTodoListContext);
  const setTodoList = React.useContext(SetTodoListContext);
  const {values, setValues, handleChange, errors, isValid, resetForm} = useFormValidator({});
  const [filesList, setFilesList] = React.useState({});
  const [isChecked, setIsChecked] = React.useState(false);

  function handleChangeInputFiles(e) {
    setFilesList(e.target.files);
  }

  function handleChangeInputCheckbox(e) {
    setIsChecked(e.target.checked);
  }

  function resetInputs() {
    resetForm();
    setFilesList({});
    setIsChecked(false);
  }

  function handleResetForm(e) {
    if (e) {
      e.preventDefault();
    }

    if (currentTodoItem) {
      setCurrentTodoItem(null);
    }

    resetInputs();
  }

  function handleSubmitForm(e) {
    e.preventDefault();

    const newFilesList = currentTodoItem
      ? Array.from(filesList).concat(currentTodoItem.files)
      : Array.from(filesList);

    const newTodo = {
      id: currentTodoItem ? currentTodoItem.id : todoList.length + 1,
      title: values.title,
      description: values.description,
      dateFinish: values.dateFinish,
      isChecked: isChecked,
      files: newFilesList,
    }

    if (currentTodoItem) {
      const indexCurrentTodo = todoList.findIndex(item => item.id === currentTodoItem.id);
      const newTodoList = todoList.map(item => item);
      newTodoList.splice(indexCurrentTodo, 1, newTodo);

      setTodoList(newTodoList);
    } else {
      setTodoList([newTodo, ...todoList]);
    }

    handleResetForm();
  }

  React.useEffect(() => {
    resetInputs();

    if (currentTodoItem) {
      setValues({
        title: currentTodoItem.title,
        description: currentTodoItem.description,
        dateFinish: currentTodoItem.dateFinish,
      });
      setFilesList(currentTodoItem.files);
      setIsChecked(currentTodoItem.isChecked)
    }
  }, [currentTodoItem])

  return (
    <form
      name={currentTodoItem ? 'edit-item' : 'add-item'}
      onSubmit={handleSubmitForm}
      onReset={handleResetForm}
      className="form"
    >
      <h2 className="form__name">{`${currentTodoItem ? 'Редактировать' : 'Добавить'} задачу`}</h2>

      <fieldset className="form__fieldset">
        <label className="form__field form__field_content_title">
          Название:
          <input
            type="text"
            name="title"
            value={values.title || ''}
            onChange={handleChange}
            required
            minLength="2"
            maxLength="20"
            className="form__input"/>
          <span className="form__error">{errors.title}</span>
        </label>

        <label className="form__field form__field_content_description">
          <textarea
            name="description"
            value={values.description || ''}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="50"
            rows="4"
            placeholder="Введите описание"
            className="form__textarea"/>
          <span className="form__error">{errors.description}</span>
        </label>

        <label className="form__field form__field_content_date">
          Срок завершения:
          <input
            type="date"
            name="dateFinish"
            value={values.dateFinish || ''}
            onChange={handleChange}
            required
            className="form__input"/>
          <span className="form__error">{errors.dateFinish}</span>
        </label>

        <label className="form__field_content_files">
          <input
            type="file"
            name="files"
            files={filesList}
            onChange={handleChangeInputFiles}
            multiple
            className="form__input"/>
        </label>

        <label className="form__field_content_checked">
          Выполнено:
          <input
            type="checkbox"
            name="isChecked"
            checked={isChecked}
            onChange={handleChangeInputCheckbox}
            className="form__input"/>
        </label>
      </fieldset>

      <div className="form__buttons">
        <button
          type="reset"
          disabled={!Object.keys(values).length}
          aria-label="reset form"
          className="form__button form__button_type_reset"
        >
          Очистить
        </button>

        <button
          type="submit"
          disabled={!isValid}
          aria-label="add todo"
          className="form__button form__button_type_submit"
        >
          {currentTodoItem ? 'Редактировать' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}