import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatBot from "./components/ChatBot";

import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import PoseSession from "./pages/PoseSession";
import LiveSession from "./pages/LiveSession";
import Mentoring from "./pages/Mentoring";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* Dim overlay — mobile only */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <div className="main-area">
          <Topbar onMenuClick={openSidebar} />

          <main className="page-content">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/sessions"
                element={<Sessions />}
              />

              <Route
                path="/session/:poseId"
                element={<PoseSession />}
              />

              <Route
                path="/live"
                element={<LiveSession />}
              />

              <Route
                path="/mentoring"
                element={<Mentoring />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </main>
        </div>

        {/* VITA AI Assistant */}
        <ChatBot />

      </div>
    </BrowserRouter>
  );
}

export default App;