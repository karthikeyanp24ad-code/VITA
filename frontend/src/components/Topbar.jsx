import { Menu, CalendarDays, ChevronRight, Monitor } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_NAMES = {
  "/":          "Dashboard",
  "/sessions":  "Yoga Sessions",
  "/live":      "Live Sessions",
  "/mentoring": "One-to-One Mentoring",
  "/profile":   "Profile",
  "/settings":  "Settings",
};

function Topbar({ onMenuClick }) {
  const location = useLocation();
  const pageName = PAGE_NAMES[location.pathname] ?? "Dashboard";

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });

  return (
    <header className="topbar">

      {/* LEFT */}
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-root">YOGAMAT</span>
          <ChevronRight size={13} className="breadcrumb-sep" aria-hidden="true" />
          <span className="breadcrumb-page">{pageName}</span>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        <div className="topbar-date">
          <CalendarDays size={15} aria-hidden="true" />
          <span>{dateStr}</span>
        </div>

        <div className="topbar-divider" aria-hidden="true" />

        <div className="topbar-space">
          <Monitor size={14} aria-hidden="true" />
          <span>Your practice space</span>
        </div>
      </div>

    </header>
  );
}

export default Topbar;
