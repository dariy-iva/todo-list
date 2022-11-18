import React from 'react';
import dayjs from "dayjs";
import './TodoForm.less';
import {GetCurrentTodoItemContext, SetCurrentTodoItemContext} from "../../context/CurrentTodoItemContext";
import {GetTodoListContext, SetTodoListContext} from "../../context/TodoListContext";
import useFormValidator from "../../hooks/useFormValidator";

export default function TodoForm() {
  const currentTodoItem = React.useContext(GetCurrentTodoItemContext);
  const setCurrentTodoItem = React.useContext(SetCurrentTodoItemContext);
  const todoList = React.useContext(GetTodoListContext);
  const setTodoList = React.useContext(SetTodoListContext);
  const {values, setValues, handleChange, errors, isValid, resetForm} = useFormValidator({});
  const [filesInput, setFilesInput] = React.useState(null);

  const fileInputText = !filesInput || Object.keys(filesInput).length === 0
    ? 'Файлы не выбраны'
    : `Выбрано файлов: ${filesInput.length}`

  /**
   * функция обрабатывает событие изменений в поле типа 'file'
   * @param {Object} e событие в DOM
   * @return {VoidFunction} записывает выбранные пользователем файлы в стейт
   */
  function handleChangeInputFiles(e) {
    console.log(typeof e)
    setFilesInput(e.target.files);
    setValues((prevValue) => {
      prevValue.files = e.target.value;
      return prevValue;
    });
  }

  /**
   * функция очищает стейт с данными полей формы
   * @return {VoidFunction}
   */
  function resetInputs() {
    resetForm();
    setFilesInput(null);
  }

  /**
   * функция обрабатывает событие очистки формы
   * @param {Object} e событие в DOM
   * @return {VoidFunction} очищает стейт с выбранной задачей и стейт с данными полей формы
   */
  function handleResetForm(e) {
    if (e) {
      e.preventDefault();
    }

    if (currentTodoItem) {
      setCurrentTodoItem(null);
    }

    resetInputs();
  }

  /**
   * функция обрабатывает событие отправки формы
   * @param {Object} e событие в DOM
   * @return {VoidFunction} собирает данные с полей формы, создает новую задачу из данных полей,
   * записывает новую задачу в todo-лист
   */
  function handleSubmitForm(e) {
    e.preventDefault();

    const newTodo = {
      id: currentTodoItem ? currentTodoItem.id : todoList.length + 1,
      title: values.title,
      description: values.description,
      dateFinish: dayjs(values.dateFinish).format('YYYY-MM-DD'),
      isChecked: values.isChecked,
      files: Array.from(filesInput),
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
        isChecked: currentTodoItem.isChecked,
      });
      currentTodoItem.files.length && setFilesInput(currentTodoItem.files);
    }
  }, [currentTodoItem]);

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

        <div className="form__field form__field_content_files-checked">
          <label className="form__field form__field_content_files">
            <input
              type="file"
              name="files"
              files={filesInput}
              onChange={handleChangeInputFiles}
              multiple
              className="form__input"/>
            <span className="form__file">Выбрать файл</span>
            <span className="form__file-text">{fileInputText}</span>
          </label>

          <label className="form__field form__field_content_checked">
            Выполнено:
            <input
              type="checkbox"
              name="isChecked"
              value={values.isChecked || false}
              checked={values.isChecked || false}
              onChange={handleChange}
              className="form__input"/>
          </label>
        </div>
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