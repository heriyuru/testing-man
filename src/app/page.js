'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restId, setRestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveFCMToken = async (restaurantId) => {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getMessaging, getToken } = await import('firebase/messaging');

      const firebaseConfig = {
        apiKey: "AIzaSyDZ2uueufL3iXjyY2q-p1YT4III3xsZfgY",
        authDomain: "realdel-f964c.firebaseapp.com",
        projectId: "realdel-f964c",
        storageBucket: "realdel-f964c.firebasestorage.app",
        messagingSenderId: "118715949536",
        appId: "1:118715949536:web:9d37749a6c6e2346548b85"
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: serviceWorkerRegistration
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
      console.error("❌ FCM failed:", error);
    }
  };

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

      await saveFCMToken(restaurantId);

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
            style={{ display: 'block', margin: '8px 0', padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', margin: '8px 0', padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#ccc' : '#0070f3',
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
