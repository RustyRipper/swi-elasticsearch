import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import SongPage from './pages/SongPage';

export default function App() {
  const [filters, setFilters] = useState({
    query: "",
    artist: "",
    language: "",
    yearFrom: 2012,
    yearTo: 2015,
    sortBy: "relevance",
  });

  const [results, setResults] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              filters={filters}
              setFilters={setFilters}
              results={results}
              setResults={setResults}
            />
          }
        />
        <Route path="/songs/details" element={<SongPage />} />
      </Routes>
    </Router>
  );
}
