// types/review.ts

export interface Review {
  _id?: string;
  hospitalId: string;
  rating: number;
  text: string;
  user:  string;
  createdAt?: string;
  updatedAt?: string;
}

  
  export interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
  }
  