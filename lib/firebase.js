// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app"; // removed getApp as it wasn't used
import { getMessaging} from "firebase/messaging"; // Added isSupported for extra safety

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ2uueufL3iXjyY2q-p1YT4III3xsZfgY",
  authDomain: "realdel-f964c.firebaseapp.com",
  projectId: "realdel-f964c",
  storageBucket: "realdel-f964c.firebasestorage.app",
  messagingSenderId: "118715949536",
  appId: "1:118715949536:web:9d37749a6c6e2346548b85",
  measurementId: "G-XGFZJKTF9D"
};

let messaging = null;
let app = null;

if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase init error:", error);
  }
}

export { messaging, getToken };