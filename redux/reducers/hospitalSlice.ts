import { Hospital, HospitalData, HospitalState } from "@/types/hospital";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.HOSPITAL_API_URL;

// CREATE hospital
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

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create hospital"
      );
    }
  }
);

// LOGIN hospital
export const loginHospital = createAsyncThunk<
  Hospital,
  { email: string; password: string }
>("hospital/login", async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
});

// FETCH ALL hospitals
export const fetchAllHospitals = createAsyncThunk<Hospital[]>(
  "hospital/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/allHospitals`);
      return response.data.hospitals;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospitals"
      );
    }
  }
);

// FETCH hospital by ID
export const fetchHospitalById = createAsyncThunk<Hospital, string>(
  "hospital/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.hospital;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch hospital"
      );
    }
  }
);

// UPDATE hospital profile
export const updateHospitalProfile = createAsyncThunk<
  Hospital,
  { id: string; data: Partial<Hospital> }
>(
  "hospital/updateProfile",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const response = await axios.put(
        `${API_URL}/update-profile/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.hospital;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update hospital profile"
      );
    }
  }
);

// VERIFY QR code by hospital ID
export const verifyHospitalQRToken = createAsyncThunk<Hospital, string>(
  "hospital/verifyQR",
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify-qr-hospital`, {
        hospitalId,
      });

      return response.data.hospital;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "QR code verification failed"
      );
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
      .addCase(createHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHospital.fulfilled, (state, action) => {
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
      .addCase(loginHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hospital = action.payload;
      })
      .addCase(loginHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to login hospital";
      })

      .addCase(fetchAllHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload;
      })
      .addCase(fetchAllHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchHospitalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHospital = action.payload;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateHospitalProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHospitalProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.hospital = action.payload;
      })
      .addCase(updateHospitalProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(verifyHospitalQRToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyHospitalQRToken.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHospital = action.payload;
      })
      .addCase(verifyHospitalQRToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default hospitalSlice.reducer;
