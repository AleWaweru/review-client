export interface HospitalData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface Hospital {
    name: string;
    email: string;
    phone:string;
    website:string;
    image:string;
    images:string[];
    address:{
      street: string;
      city:string;
      country:string;
        }
    
  }
  
  export interface HospitalState {
    loading: boolean;
    hospital: Hospital | null;
    error: string | null;
    hospitals: Hospital[];         // New
    selectedHospital: Hospital | null; // New
  }
  