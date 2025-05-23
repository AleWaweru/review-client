import { Review, ReviewState } from "@/types/review";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_REVIEW_API_URL;
// Thunk: Submit a new review
export const submitReview = createAsyncThunk<
  Review,
  Omit<Review, "_id" | "createdAt" | "updatedAt">,
  { rejectValue: { message: string; flaggedAttributes?: any[] } }
>("review/submitReview", async (reviewData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/createReview`, reviewData);
    return res.data;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Submission failed";
    const flaggedAttributes = err.response?.data?.flaggedAttributes;
    return rejectWithValue({ message: errorMessage, flaggedAttributes });
  }
});


// Thunk: Fetch reviews for a hospital
export const fetchReviews = createAsyncThunk<
  Review[],
  string,
  { rejectValue: { message: string } }
>("review/fetchReviews", async (hospitalId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${API_URL}/getReviewsByHospital/${hospitalId}`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue({
      message: err.response?.data?.error || "Fetch failed",
    });
  }
});

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  flaggedAttributes: undefined,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
       state.flaggedAttributes = undefined;
    },
  },
  extraReducers: (builder) => {
     builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.flaggedAttributes = undefined;
      })
      .addCase(submitReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit review";
        state.flaggedAttributes = action.payload?.flaggedAttributes;
      })

      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<Review[]>) => {
          state.loading = false;
          state.reviews = action.payload;
        }
      )
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch reviews";
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
