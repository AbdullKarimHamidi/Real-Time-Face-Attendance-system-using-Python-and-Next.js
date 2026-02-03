export default function Home() {
  const cameras = ["herat", "kabul", "mazar"]

  return (
    <main style={{ padding: 20 }}>
      <h1>Live Camera Feeds</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {cameras.map((cam) => (
          <div key={cam} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{cam.toUpperCase()}</h3>
            <img
              src={`http://localhost:8000/video/${cam}`}
              alt={cam}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
