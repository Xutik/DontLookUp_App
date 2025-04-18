// Notification Component
export function Notification({ notification, setNotification }) {
  if (!notification.show) return null;

  return (
    <div className={`notification ${notification.type}`} role="alert">
      <div className="notification-content">
        <span className="notification-message">
          {notification.type === "success" ? "✓ " : "✕ "}
          {notification.message}
        </span>
        <button className="notification-close" onClick={() => setNotification({ ...notification, show: false })} aria-label="Close notification">
          ×
        </button>
      </div>
    </div>
  );
}
