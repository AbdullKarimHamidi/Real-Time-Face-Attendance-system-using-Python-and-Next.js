"use client";
import { useState } from "react";

export default function CameraViewer() {
  const [city, setCity] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const handleOpenCamera = () => {
    setActiveCity(city); // open selected camera
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Select Camera City</h2>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: 10, fontSize: 16 }}
      >
        <option value="">-- Select City --</option>
        <option value="kabul">Kabul</option>
        <option value="herat">Herat</option>
        <option value="mazar">Mazar</option>
      </select>

      <button
        onClick={handleOpenCamera}
        disabled={!city}
        style={{
          marginLeft: 10,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Open Camera
      </button>

      <hr style={{ margin: "20px 0" }} />

      {activeCity && (
        <div>
          <h3>Camera: {activeCity.toUpperCase()}</h3>

          <img
            src={`http://localhost:8000/video_feed/${activeCity}`}
            alt="Camera Stream"
            style={{
              width: "640px",
              border: "3px solid #00ff00",
              borderRadius: 10,
            }}
          />
        </div>
      )}
    </div>
  );
}
