export default function SongDetails({ song }) {
  return (
    <div>
      <h2>{song.title}</h2>
      <p><strong>Artysta:</strong> {song.artist}</p>
      <p><strong>Rok:</strong> {song.year}</p>
      <p><strong>Wyświetlenia:</strong> {song.views}</p>
      <p><strong>Tag:</strong> {song.tag}</p>
      <p><strong>Język:</strong> {song.language}</p>
      <p><strong>Tekst:</strong></p>
      <pre>{song.lyrics}</pre>
    </div>
  );
}
