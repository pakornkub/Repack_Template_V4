import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  qrResult: {}
};

const qrSlice = createSlice({
  name: "qr",
  initialState,
  reducers: {
    setQR: (state, action) => {
      state.qrResult = action.payload
    }
  }
});

//get state (useSelector)
export const selectQR = (state: any) => state.qr;

//set actions (useDispatch)
export const { setQR } = qrSlice.actions;

//set reducer (use store)
export default qrSlice.reducer;