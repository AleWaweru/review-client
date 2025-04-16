// types.ts
export interface Profile {
    _id?: string;
    userId?: string;
    phone: string;
    address: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
  }
  