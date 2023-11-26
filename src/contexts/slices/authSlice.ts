import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authResult: JSON.parse(localStorage.getItem("auth") || "{}")
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.authResult = action.payload
      localStorage.setItem('auth', JSON.stringify(action.payload))
      localStorage.setItem('accessStatus', JSON.stringify(action.payload?.status || false))
      localStorage.setItem('accessToken', JSON.stringify(action.payload?.data?.token || ''))
    }
  }
});

//get state (useSelector)
export const selectAuth = (state: any) => state.auth;

//set actions (useDispatch)
export const { setAuth } = authSlice.actions;

//set reducer (use store)
export default authSlice.reducer;