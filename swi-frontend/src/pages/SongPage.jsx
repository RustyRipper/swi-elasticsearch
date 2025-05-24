import { useLocation, useNavigate } from "react-router-dom";

function SongPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const song = location.state?.song;

  if (!song) {
    return (
      <p
        style={{
          padding: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#666",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Brak danych piosenki
      </p>
    );
  }

  return (
    <div
      style={{
        padding: "30px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#e9f0f7",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        {/* Przycisk Powrót */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginBottom: "25px",
            cursor: "pointer",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
        >
          ← Powrót
        </button>

        {/* Ramka ze szczegółami */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: "30px",
            color: "#1e3a8a",
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "15px" }}>{song.title || "Brak tytułu"}</h1>
          <p style={{ margin: "6px 0" }}>
            <strong>Wykonawca:</strong> {song.artist || "Nieznany"}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Język:</strong> {song.language || "-"}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong>Rok:</strong> {song.year || "-"}
          </p>
        </div>

        {/* Ramka z tekstem piosenki */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #93c5fd",
            boxShadow: "inset 0 1px 3px rgba(59, 130, 246, 0.2)",
            color: "#333",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "15px", color: "#1e40af" }}>
            Tekst piosenki
          </h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            {song.lyrics || "Brak tekstu do wyświetlenia"}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SongPage;
