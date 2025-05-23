// types/review.ts
export interface ReviewUser{
  _id: string;
  name: string
}
export interface Review {
  _id?: string;
  hospitalId: string;
  rating: number;
  text: string;
  user:  ReviewUser;
  createdAt?: string;
  updatedAt?: string;
}

  
  export interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    flaggedAttributes?: any[];
  }
  