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

// Fetch all hospitals (public access)
export const fetchAllHospitals = createAsyncThunk<Hospital[]>(
  "hospital/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/allHospitals`);
      return response.data.hospitals;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch hospitals");
    }
  }
);

// Fetch hospital by ID (public access)
export const fetchHospitalById = createAsyncThunk<Hospital, string>(
  "hospital/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.hospital;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch hospital");
    }
  }
);


// Initial state
const initialState: HospitalState = {
  loading: false,
  hospital: null,
  error: null,
  hospitals: [],
  selectedHospital: null,
};

// Slice
const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    //create hospital
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
      //login hospital      
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
      })

      // get all hospitals
      .addCase(fetchAllHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHospitals.fulfilled, (state, action: PayloadAction<Hospital[]>) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchAllHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // get hospital by id
      .addCase(fetchHospitalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action: PayloadAction<Hospital>) => {
        state.loading = false;
        state.selectedHospital = action.payload;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default hospitalSlice.reducer;
