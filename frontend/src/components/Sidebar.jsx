import {
  LayoutDashboard,
  PlaySquare,
  Video,
  Users,
  User,
  Settings,
  Heart,
  ChevronRight,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/",
    icon: <LayoutDashboard size={19} />,
    label: "Dashboard",
  },
  {
    to: "/sessions",
    icon: <PlaySquare size={19} />,
    label: "Yoga Sessions",
  },
  {
    to: "/live",
    icon: <Video size={19} />,
    label: "Live Sessions",
    dot: true,
  },
  {
    to: "/mentoring",
    icon: <Users size={19} />,
    label: "One-to-One Mentoring",
  },
  {
    to: "/profile",
    icon: <User size={19} />,
    label: "Profile",
  },
  {
    to: "/settings",
    icon: <Settings size={19} />,
    label: "Settings",
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>

        {/* LOGO + MOBILE CLOSE */}
        <div className="sidebar-logo">
          <div className="logo-mark">Y</div>

          <div className="logo-text">
            <div className="logo-title">YOGAMAT.</div>
            <div className="logo-subtitle">MOVE · BREATHE · RETURN</div>
          </div>

          {/* close button — only visible on mobile */}
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* SECTION LABEL */}
        <div className="sidebar-section-title">YOUR PRACTICE</div>

        {/* NAV */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon, label, dot }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {icon}
              <span>{label}</span>
              {dot && <span className="live-dot" aria-hidden="true" />}
            </NavLink>
          ))}
        </nav>

        {/* SMALL MOMENTS CARD */}
        <div className="sidebar-message">
          <div className="message-icon">
            <Heart size={18} />
          </div>
          <div className="message-title">Small moments add up.</div>
          <div className="message-text">Be kind to your pace today.</div>
        </div>

        {/* PROFILE */}
        <div className="sidebar-profile">
          <div className="profile-avatar">Y</div>

          <div className="profile-info">
            <strong>Your profile</strong>
            <span>Beginner</span>
            <small>A little space to feel better.</small>
          </div>

          <ChevronRight size={18} className="profile-arrow" />
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
