const images = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
];

export default function Gallery() {
  return (
    <section className="page">
      <h1>TechFest Gallery</h1>

      <div className="gallery">
        {images.map((image, index) => (
          <img
            key={index}
            src={`${image}?auto=format&fit=crop&w=600&q=80`}
            alt={`TechFest event ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
