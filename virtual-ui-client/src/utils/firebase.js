
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPCrn7tfkCZaVQmAx4LzSocCqOmYC8OCM",
  authDomain: "react-89cec.firebaseapp.com",
  projectId: "react-89cec",
  storageBucket: "react-89cec.firebasestorage.app",
  messagingSenderId: "319236782293",
  appId: "1:319236782293:web:3857df9d8f0b39dd1fca5c",
  measurementId: "G-6NMS7WXVV5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence).catch(err => 
  console.warn("Persistence error:", err)
);

const provider = new GoogleAuthProvider();
provider.setDefaultLanguage("en");

console.log("🔥 Firebase initialized for:", window.location.hostname);

export { auth, provider };