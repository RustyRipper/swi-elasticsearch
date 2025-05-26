import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Home({ filters, setFilters, results, setResults }) {
  const location = useLocation();

useEffect(() => {
  if (location.state?.artist) {
    const artistName = location.state.artist;

    const newFilters = {
      query: "",
      artist: artistName,
      language: "",
      yearFrom: "",
      yearTo: "",
      sortBy: "",
    };

    setFilters(newFilters);
    fetchSongs(newFilters);

    // Wyczyść state (zastąp bieżący wpis w historii)
    window.history.replaceState({}, document.title);
  }
}, [location.state]);



  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchSongs = async (customFilters = filters) => {
    const cf = { ...customFilters };
    if (cf.artist && cf.artist.trim().includes(" ")) {
      cf.query = cf.artist.trim();
      cf.artist = "";               
    }
    const filteredParams = Object.fromEntries(
      Object.entries(cf)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => [
          key,
          key === "artist" ? value.toLowerCase() : value,
        ])
    );

    const params = new URLSearchParams(filteredParams).toString();
    const res = await fetch(`http://localhost:8080/api/songs/search?${params}`);
    const data = await res.json();
    setResults(data);
  };


  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#e9f0f7",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "2.5rem",
          color: "#1e3a8a",
        }}
      >
        🎵 SONG FINDER
      </h1>

      {/* Pasek wyszukiwania z przyciskiem */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Wpisz frazę"
          name="query"
          value={filters.query}
          onChange={handleChange}
          style={{
            width: "300px",
            padding: "10px 14px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #90cdf4",
            backgroundColor: "#f0f9ff",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
        <button
          onClick={() => fetchSongs()}
          style={{
            padding: "10px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          🔍 Szukaj
        </button>
      </div>

      {/* Sortowanie */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#3b82f6",
          padding: "15px 30px",
          borderRadius: "10px",
          marginBottom: "25px",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          color: "white",
          fontWeight: "600",
          gap: "30px",
          alignItems: "center",
          fontSize: "16px",
          userSelect: "none",
        }}
      >
        <span>Sortuj według:</span>

        {["views", "year", "relevance"].map((option) => (
          <label
            key={option}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              backgroundColor:
                filters.sortBy === option ? "rgba(255, 255, 255, 0.25)" : "transparent",
              padding: "6px 14px",
              borderRadius: "20px",
              transition: "background-color 0.3s",
            }}
          >
            <input
              type="radio"
              name="sortBy"
              value={option}
              checked={filters.sortBy === option}
              onChange={handleChange}
              style={{ cursor: "pointer" }}
            />
            {option === "views"
              ? "Popularność"
              : option === "year"
              ? "Rok wydania"
              : "Relewancja"}
          </label>
        ))}
      </div>

      {/* Układ boczny + wyniki */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* Boczny panel */}
        <div
          style={{
            minWidth: "250px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "fit-content",
          }}
        >
          <div>
            <label style={{ fontWeight: "600", color: "#1d4ed8" }}>🎤 Wykonawca</label>
            <input
              type="text"
              name="artist"
              value={filters.artist}
              onChange={handleChange}
              placeholder="np. Adele"
              style={{
                width: "90%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "6px",
                border: "1px solid #93c5fd",
                backgroundColor: "#f0f9ff",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "600", color: "#1d4ed8" }}>📅 Rok wydania</label>
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <input
                type="number"
                name="yearFrom"
                value={filters.yearFrom}
                onChange={handleChange}
                min="1950"
                max="2025"
                placeholder="od"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #93c5fd",
                  backgroundColor: "#f0f9ff",
                }}
              />
              <input
                type="number"
                name="yearTo"
                value={filters.yearTo}
                onChange={handleChange}
                min="1950"
                max="2025"
                placeholder="do"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #93c5fd",
                  backgroundColor: "#f0f9ff",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: "600", color: "#1d4ed8" }}>🌐 Język</label>
            <select
              name="language"
              value={filters.language}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #93c5fd",
                backgroundColor: "#f0f9ff",
                marginTop: "5px",
              }}
            >
              <option value="">Wybierz</option>
              <option value="en">angielski</option>
              <option value="fr">francuski</option>
              <option value="pt">portugalski</option>
              <option value="es">hiszpański</option>
              <option value="de">niemiecki</option>
              <option value="ru">rosyjski</option>
              <option value="zh">chiński</option>
            </select>
          </div>
        </div>

        {/* Wyniki */}
        <div style={{ flex: 1 }}>
          {results.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              Brak wyników. Wpisz frazę i kliknij "Szukaj".
            </p>
          )}
          {results.map((song, index) => (
            <Link
              key={index}
              to="/songs/details"
              state={{ song }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3 style={{ margin: "0 0 10px", color: "#1e40af" }}>
                  {song.title || "Brak tytułu"}
                </h3>
                <p>
                  <strong>Wykonawca:</strong> {song.artist || "Nieznany"}
                </p>
                <p>
                  <strong>Język:</strong> {song.language || "-"}
                </p>
                <p>
                  <strong>Rok:</strong> {song.year || "-"}
                </p>
                <p>
                  <strong>Wyświetlenia:</strong> {(song.views ?? 0).toLocaleString("pl-PL")}
                </p>
                <p style={{ fontStyle: "italic", color: "#555" }}>
                  {song.lyrics
                    ? song.lyrics.length > 200
                      ? song.lyrics.slice(0, 200) + "..."
                      : song.lyrics
                    : "Brak tekstu do wyświetlenia"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
