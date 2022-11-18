import React from "react";

/**
 * функция валидирования формы
 * @param {Object} defaultValues начальные значения полей формы
 * @return {Object} возвращает объект с свойствами и методами валидации
 */
export default function useFormValidator(defaultValues) {
  const [values, setValues] = React.useState(defaultValues);
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);

  /**
   * функция обрабатывает событие изменений в поле формы
   * @param {Object} event событие в DOM
   * @return {VoidFunction} записывает стейты с полученными значениями полей формы, ошибки полей формы и валидности формы
   */
  const handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setValues({...values, [name]: value});
    setErrors({...errors, [name]: target.validationMessage });
    setIsValid(target.closest("form").checkValidity());
  };

  /**
   * функция очистки стейтов значений полей формы, ошибок полей формы и валидности формы
   * @param {Object} e событие в DOM
   * @return {VoidFunction}
   */
  const resetForm = React.useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid]
  );

  return { values, setValues, handleChange, errors, isValid, resetForm };
}