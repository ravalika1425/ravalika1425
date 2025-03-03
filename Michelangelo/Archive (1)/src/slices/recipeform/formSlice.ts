import { createSlice } from '@reduxjs/toolkit';

interface FormState {
  ideaName: string;
  ideaDescription: string;
  vertical: string;
  strategy: string;
  competitors: string;
  businessNature: string;
}

const initialState: FormState = {
  ideaName: "",
  ideaDescription: "",
  vertical: "",
  strategy: "",
  competitors: "",
  businessNature: ""
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData(state, action) {
      // You can update the form data here based on the action payload
      return { ...state, ...action.payload };
    }
  }
});

export const { updateFormData } = formSlice.actions;
export default formSlice.reducer;
