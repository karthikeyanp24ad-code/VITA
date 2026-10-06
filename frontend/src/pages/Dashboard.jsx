import {
  Play,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Target,
  Heart,
  Sun,
  Camera,
  Info,
  Wind,
} from "lucide-react";

import heroImg from "../assets/hero.jpg";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* INTRO */}
      <section className="dashboard-intro">

        <div>
          <div className="eyebrow">
            <span></span>
            YOUR SPACE TO RESET
          </div>

          <h1>
            Good morning, <em>there.</em>
          </h1>

          <p>
            Move, breathe, and build a healthier you.
          </p>
        </div>

        <div className="intro-note">
          <div className="sun-icon">
            <Sun size={21} />
          </div>

          <span>One breath at a time</span>
        </div>

      </section>


      {/* TODAY'S PRACTICE */}
      <section className="hero-card">

        <div className="hero-content">

          <div className="hero-label">
            <span>✧</span>
            TODAY'S PRACTICE
          </div>

          <h2>
            Find your
            <br />
            <em>steady.</em>
          </h2>

          <p>
            Save your age in Profile to make today's
            suggestions more personal.
          </p>

          <div className="hero-actions">

            <button className="primary-button">
              <Play size={15} fill="currentColor" />
              Start yoga session
            </button>

            <button className="text-button">
              View progress
              <ArrowRight size={17} />
            </button>

          </div>


          {/* Suggested pose */}
          <div className="suggestion">

            <div className="suggestion-line">
              <span className="suggestion-dot"></span>
            </div>

            <div className="suggestion-content">
              <span>Suggested today</span>

              <strong>Marjariasana</strong>

              <small>7 min · Beginner</small>
            </div>

          </div>

        </div>


        {/* HERO IMAGE */}
        <div className="hero-image">

          <img src={heroImg} alt="Yoga practitioner in Marjariasana pose on a purple mat" />

          <div className="hero-image-overlay" />

          <div className="hero-image-caption">
            01 / A moment for you
          </div>

          <div className="hero-logo">
            Y.
          </div>

          <div className="hero-vertical-text">
            Move with intention
            <br />
            and room to breathe.
          </div>

        </div>

      </section>


      {/* YOUR RHYTHM */}
      <section className="rhythm-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              YOUR RHYTHM
            </span>

            <h2>
              A practice taking shape
            </h2>
          </div>

          <button className="history-button">
            All history
            <ArrowRight size={16} />
          </button>

        </div>


        {/* METRICS */}
        <div className="metrics-grid">

          <MetricCard
            icon={<CheckCircle2 size={20} />}
            title="Sessions completed"
            value="0"
            description="Your practice, at your pace"
            type="green"
          />

          <MetricCard
            icon={<Clock3 size={20} />}
            title="Practice minutes"
            value="0"
            suffix="min"
            description="Time you've made for you"
            type="rose"
          />

          <MetricCard
            icon={<Target size={20} />}
            title="Avg. alignment signal"
            value="—"
            description="Geometric estimate, not ML accuracy"
            type="purple"
          />

          <MetricCard
            icon={<Heart size={20} />}
            title="Current streak"
            value="0"
            suffix="days"
            description="Returning is the real win"
            type="gold"
          />

        </div>


        {/* ANALYTICS */}
        <div className="analytics-grid">

          <WeeklyCard />

          <SmartMatCard />

        </div>


        {/* DEVICES */}
        <div className="devices-card">

          <div className="device-title">

            <div className="device-icon">
              <Camera size={19} />
            </div>

            <div>
              <strong>Your devices</strong>

              <span>
                Connection status
              </span>
            </div>

          </div>


          <div className="device-status">

            <span className="status-dot connected"></span>

            <div>
              <strong>
                Camera & pose engine
              </strong>

              <span>
                YOLO11 ready · webcam starts when you choose
              </span>
            </div>

          </div>


          <div className="device-status">

            <span className="status-dot"></span>

            <div>
              <strong>
                YOGAMAT Smart Mat
              </strong>

              <span>
                Not connected · simulated
              </span>
            </div>

          </div>


          <button className="manage-button">
            Manage
            <ArrowRight size={17} />
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="dashboard-footer">

        <span>
          YOGAMAT · Move, breathe, return.
        </span>

        <span>
          General wellness guidance · not medical care
        </span>

      </footer>

    </div>
  );
}


/* =====================================================
   METRIC CARD
===================================================== */

function MetricCard({
  icon,
  title,
  value,
  suffix,
  description,
  type,
}) {
  return (
    <div className="metric-card">

      <div className={`metric-icon ${type}`}>
        {icon}
      </div>

      <div className="metric-content">

        <span className="metric-title">
          {title}
        </span>

        <div className="metric-value">

          {value}

          {suffix && (
            <small>
              {suffix}
            </small>
          )}

        </div>

        <span className="metric-description">
          {description}
        </span>

      </div>

    </div>
  );
}


/* =====================================================
   WEEKLY CARD
===================================================== */

function WeeklyCard() {

  const days = [
    "W",
    "T",
    "F",
    "S",
    "S",
    "M",
    "T",
  ];

  return (
    <div className="analytics-card weekly-card">

      <div className="analytics-header">

        <div>

          <span className="section-label">
            THIS WEEK
          </span>

          <h3>
            Showing up counts.
          </h3>

        </div>

        <button className="period-button">
          Last 7 days
          <span>⌄</span>
        </button>

      </div>


      <div className="weekly-summary">

        <strong>0</strong>

        <span>min</span>

        <small>
          0 practices this week
        </small>

      </div>


      <div className="chart">

        {days.map((day, index) => (

          <div
            className="chart-column"
            key={`${day}-${index}`}
          >

            <div className="chart-bar">
              <span></span>
            </div>

            <small>
              {day}
            </small>

          </div>

        ))}

      </div>


      <div className="chart-footer">

        <span>
          <i></i>
          Practice minutes
        </span>

        <small>
          Your first session will appear here
        </small>

      </div>

    </div>
  );
}


/* =====================================================
   SMART MAT CARD
===================================================== */

function SmartMatCard() {

  return (
    <div className="analytics-card smart-card">

      <div className="analytics-header">

        <div>

          <span className="section-label">
            SMART MAT
          </span>

          <h3>
            Grounded in balance
          </h3>

        </div>

        <span className="demo-badge">
          <i></i>
          Demo data
        </span>

      </div>


      <div className="balance-visual">

        <div className="orbit orbit-one"></div>

        <div className="orbit orbit-two"></div>


        <div className="balance-center">

          <Wind size={25} />

          <strong>
            87%
          </strong>

          <span>
            balance
          </span>

        </div>


        <div className="balance-left">

          <span>LEFT</span>

          <strong>
            46%
          </strong>

        </div>


        <div className="balance-right">

          <span>RIGHT</span>

          <strong>
            54%
          </strong>

        </div>

      </div>


      <div className="smart-footer">

        <span>
          <i></i>
          Mat not connected
        </span>

        <span>
          Stability&nbsp;
          <strong>89%</strong>
        </span>

      </div>


      <div className="smart-info">

        <Info size={15} />

        Demo / simulated smart-mat data

      </div>

    </div>
  );
}


export default Dashboard;