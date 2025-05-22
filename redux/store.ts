import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hospitalReducer from "@/redux/reducers/hospitalSlice";
import profileReducer from "@/redux/reducers/profileSlice";
import reviewReducer from "@/redux/reducers/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,
    profile: profileReducer,
    reviews: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
