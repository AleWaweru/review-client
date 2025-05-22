export interface HospitalData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface Hospital {
    _id: string;
    name: string;
    email: string;
    phone:string;
    website:string;
    image?:string;
    images?:string[];
    location:string;
    
  }
  
  export interface HospitalState {
    loading: boolean;
    hospital: Hospital | null;
    error: string | null;
    hospitals: Hospital[];        
    selectedHospital: Hospital | null; 
  }
  