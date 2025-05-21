import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Profile, ProfileState } from "@/types/profile";
import { RootState } from "../store";

const API_URL = process.env.EXPO_PUBLIC_PROFILE_API_URL;

// CREATE profile
export const createProfile = createAsyncThunk<
  Profile,
  Omit<Profile, "_id" | "userId">,
  { rejectValue: string }
>("profile/create", async (profileData, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const token = state.auth.token;
    console.log(token);
    const response = await axios.post(`${API_URL}/create`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response:", response);
    return response.data.profile;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create profile"
    );
  }
});

// UPDATE profile
export const updateProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>("profile/update", async (profileData, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const token = state.auth.token;
   console .log(token);
    const response = await axios.put(`${API_URL}/update`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("response:", response.data);
    return response.data.profile;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update profile"
    );
  }
});

// GET profile
export const getProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>("profile/get", async (_, { getState, rejectWithValue }) => {
  try {
  const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
   console.log("profile data", response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

// Initial State
const initialState: ProfileState = {
  loading: false,
  profile: null,
  error: null,
};

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create profile error";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update profile error";
      })

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        console.log("Profile fetched and saved to state:", action.payload);
        state.loading = false;
        state.error = action.payload || "Fetch profile error";
      });
  },
});

export default profileSlice.reducer;
