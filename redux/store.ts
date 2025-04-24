import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import hospitalReducer from "@/redux/reducers/hospitalSlice";
import profileReducer from "@/redux/reducers/profileSlice";
import reviewsReducer from "@/redux/reducers/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hospital: hospitalReducer,
    profile: profileReducer,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
