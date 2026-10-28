import EventCard from "./EventCard";

export default function EventList({ events, onRegister, onDelete }) {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onRegister={onRegister}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
