import React from "react";

function SongItem({ song }) {
  return (
    <div className="song-item">
      <div>
        <p>{song.year} - {song.views} views</p>
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
      <div>
        <span className="star">★</span>
      </div>
      <div className="lyrics">
        {song.lyrics.split(" ").slice(0, 12).join(" ")}...
      </div>
    </div>
  );
}

export default SongItem;
