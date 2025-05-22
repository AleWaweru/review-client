import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCknmwr_LTmj2KS3Q4-qE8cYJJzjEddcrc",
  authDomain: "rateme-a8afe.firebaseapp.com",
  projectId: "rateme-a8afe",
  storageBucket: "rateme-a8afe.firebasestorage.app",
  messagingSenderId: "566851869540",
  appId: "1:566851869540:web:75fc3dff0ad0bd468f7871",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
