'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restId, setRestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveFCMToken = useCallback(async (restaurantId) => {
    if (typeof window === "undefined") return;

    try {
      // Dynamic import Firebase
      const { initializeApp } = await import("firebase/app");
      const { getMessaging, getToken } = await import("firebase/messaging");

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebaseapp.com",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".appspot.com",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      
      // Request permission and get token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });

      if (token) {
        await fetch("/api/save-restaurant-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: Number(restaurantId),
            fcmToken: token
          })
        });
        console.log("✅ FCM token saved for restaurant", restaurantId);
      }
    } catch (error) {
      console.error("❌ FCM error (login continues):", error);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    let restaurantId, restLocation;

    if (email === "kushas" && password === "1234") {
      restaurantId = "1";
      restLocation = "https://maps.app.goo.gl/EaQzfEaVe1r1c6s18";
    } else if (email === "sno" && password === "12345") {
      restaurantId = "3";
      restLocation = "https://maps.app.goo.gl/hkS6Hha1cetHDUE7A";
    }

    if (restaurantId) {
      localStorage.setItem("restid", restaurantId);
      localStorage.setItem("restlocation", restLocation);
      setRestId(restaurantId);

      // Save FCM token (non-blocking)
      saveFCMToken(restaurantId);

      alert("✅ Login successful! Restaurant ID: " + restaurantId);
      router.push("/orders");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Restaurant Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ 
              display: 'block', 
              margin: '8px 0', 
              padding: '12px', 
              width: '100%', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ 
              display: 'block', 
              margin: '8px 0', 
              padding: '12px', 
              width: '100%', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {restId && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '4px' }}>
          <h3>✅ Logged in as Restaurant ID: {restId}</h3>
        </div>
      )}
    </div>
  );
}
