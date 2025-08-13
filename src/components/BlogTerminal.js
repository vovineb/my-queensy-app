import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function BookingMap({ lat, lng }) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: "200px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>Property Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default function BlogTerminal() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setPosts([...posts, input]);
      setInput("");
    }
  };

  return (
    <div className="blog-terminal">
      <h3>Blog Terminal</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Write a blog post..."
        />
        <button type="submit">Post</button>
      </form>
      <div className="posts">
        {posts.map((post, idx) => (
          <div key={idx} className="post">{post}</div>
        ))}
      </div>
      {/* Example usage of BookingMap component */}
      <BookingMap lat={property.lat} lng={property.lng} />
    </div>
  );
}