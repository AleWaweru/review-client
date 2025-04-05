import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hospitalReducer from "@/redux/reducers/hospitalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
