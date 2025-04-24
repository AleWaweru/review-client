import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Profile, ProfileState } from "@/types/profile"; // Adjust path as needed

const API_URL = process.env.PROFILE_API_URL;

// Create Profile
export const createProfile = createAsyncThunk<
  Profile, // Return type
  Omit<Profile, "userId" | "_id">, // Argument type
  { rejectValue: string } // Rejection error type
>(
  "profile/createProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const response = await axios.post(`${API_URL}/create`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.profile;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create profile"
      );
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk<
  Profile,
  Partial<Profile>,
  { rejectValue: string }
>(
  "profile/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      const response = await axios.put(`${API_URL}/update`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.profile;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Get Profile
export const getProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>("profile/getProfile", async (_, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const token = state.auth.token;
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch profile"
    );
  }
});

// Initial state
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // getProfile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default profileSlice.reducer;
