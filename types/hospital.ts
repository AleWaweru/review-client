export interface HospitalData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface Hospital {
    id: string;
    name: string;
    email: string;
    // Add more fields as needed
  }
  
  export interface HospitalState {
    loading: boolean;
    hospital: Hospital | null;
    error: string | null;
    hospitals: Hospital[];         // New
    selectedHospital: Hospital | null; // New
  }
  