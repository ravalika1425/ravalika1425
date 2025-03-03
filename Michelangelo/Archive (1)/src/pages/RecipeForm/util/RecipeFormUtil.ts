export const setFormDataToLocalStorage = (data: any) => {
  localStorage.setItem('recipeFormData', JSON.stringify(data));
};

export const getFormDataFromLocalStorage = () => {
  const data = localStorage.getItem('recipeFormData');
  return data ? JSON.parse(data) : null;
};
