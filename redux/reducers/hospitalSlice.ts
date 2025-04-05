import { Hospital, HospitalData, HospitalState } from "@/types/hospital";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.HOSPITAL_API_URL; 

// Async thunk to create hospital
export const createHospital = createAsyncThunk<Hospital, HospitalData>(
  "hospital/create",
  async (data, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const response = await axios.post(`${API_URL}/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Hospital data:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("Error creating hospital:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to create hospital");
    }
  }
);


// Async thunk to login hospital
export const loginHospital = createAsyncThunk<Hospital, { email: string; password: string }>(
  "hospital/login",
  async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  }
);

// Initial state
const initialState: HospitalState = {
  loading: false,
  hospital: null,
  error: null,
};

// Slice
const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHospital.fulfilled, (state, action: PayloadAction<Hospital>) => {
        state.loading = false;
        state.hospital = action.payload;
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })      
      .addCase(loginHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginHospital.fulfilled, (state, action: PayloadAction<Hospital>) => {
        state.loading = false;
        state.hospital = action.payload;
      })
      .addCase(loginHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to login hospital";
      });
  },
});

export default hospitalSlice.reducer;
