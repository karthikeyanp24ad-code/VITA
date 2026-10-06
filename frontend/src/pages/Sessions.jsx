import { Play, ArrowRight, Info, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/sessions.css";

import imgAnantasana     from "../assets/pose-anantasana.jpg";
import imgBhujangasana   from "../assets/pose-bhujangasana.jpg";
import imgMarjariasana   from "../assets/pose-marjariasana.jpg";
import imgTrikonasana    from "../assets/pose-trikonasana.jpg";
import imgVajrasana      from "../assets/pose-vajrasana.jpg";
import imgVirabhadrasana from "../assets/pose-virabhadrasana.jpg";

/* ── pose data ── */
const POSES = [
  {
    id: "01",
    name: "Anantasana",
    level: "Intermediate",
    duration: 8,
    description: "A side-reclining balance that invites length through the whole body.",
    focus: "Balance · hip mobility",
    image: imgAnantasana,
  },
  {
    id: "02",
    name: "Bhujangasana",
    level: "Beginner",
    duration: 6,
    description: "A gentle, supported backbend that opens the front of the body.",
    focus: "Chest · gentle extension",
    image: imgBhujangasana,
  },
  {
    id: "03",
    name: "Marjariasana",
    level: "Beginner",
    duration: 7,
    description: "A grounding hands-and-knees shape for slow spinal movement.",
    focus: "Spine · mobility",
    image: imgMarjariasana,
  },
  {
    id: "04",
    name: "Trikonasana",
    level: "Intermediate",
    duration: 8,
    description: "A wide, steady triangle with space through both sides of the torso.",
    focus: "Balance · side body",
    image: imgTrikonasana,
  },
  {
    id: "05",
    name: "Vajrasana",
    level: "Beginner",
    duration: 5,
    description: "A quiet kneeling seat for steady posture and a calmer breath.",
    focus: "Balance · breath",
    image: imgVajrasana,
  },
  {
    id: "06",
    name: "Virabhadrasana I",
    level: "Intermediate",
    duration: 8,
    description: "A grounded standing lunge with an expansive, upright reach.",
    focus: "Strength · grounding",
    image: imgVirabhadrasana,
  },
];

function Sessions() {
  return (
    <div className="sessions-page">

      {/* ── HEADER ── */}
      <section className="sessions-header">
        <div className="sessions-header-left">
          <div className="sessions-eyebrow">A PRACTICE FOR EVERY MOMENT</div>
          <h1 className="sessions-title">Yoga sessions</h1>
          <p className="sessions-subtitle">
            Six familiar shapes, one small invitation to begin.
          </p>
        </div>

        <div className="sessions-header-right">
          <span className="pose-count-num">06</span>
          <span className="pose-count-label">supported poses</span>
        </div>
      </section>

      {/* ── BANNER ── */}
      <div className="sessions-banner">
        <div className="sessions-banner-left">
          <div className="banner-icon">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="banner-title">Practice with presence.</p>
            <p className="banner-body">
              These are the six poses recognised by the supplied YOGAMAT model. The live
              classifier stays off until its exact training preprocessing is confirmed.
            </p>
          </div>
        </div>
        <button className="banner-link">
          Model supported catalog
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ── POSE GRID ── */}
      <div className="pose-grid">
        {POSES.map((pose) => (
          <PoseCard key={pose.id} pose={pose} />
        ))}
      </div>

      {/* ── FOOTER NOTE ── */}
      <div className="sessions-footnote">
        <Info size={13} />
        <span>
          Pose card imagery is illustrative. Live pose labels are shown only when the real
          YOLO11 — preprocessing → Random Forest pipeline is ready.
        </span>
      </div>

      {/* ── PAGE FOOTER ── */}
      <footer className="sessions-footer">
        <span>YOGAMAT · Move, breathe, return.</span>
        <span>General wellness guidance · not medical care</span>
      </footer>

    </div>
  );
}

/* ── POSE CARD ── */
function PoseCard({ pose }) {
  const { id, name, level, duration, description, focus, image } = pose;
  const navigate = useNavigate();

  return (
    <article className="pose-card">

      {/* image */}
      <div className="pose-card-image">
        <img src={image} alt={`${name} yoga pose`} />
        <span className="pose-card-num">{id}</span>
      </div>

      {/* body */}
      <div className="pose-card-body">

        {/* meta row */}
        <div className="pose-card-meta">
          <span className={`pose-level pose-level--${level.toLowerCase()}`}>
            {level}
          </span>
          <span className="pose-duration">{duration} min</span>
        </div>

        {/* name + description */}
        <h2 className="pose-card-name">{name}</h2>
        <p className="pose-card-desc">{description}</p>

        {/* focus tag */}
        <div className="pose-card-focus">
          <span className="focus-dot" aria-hidden="true" />
          <span>{focus}</span>
        </div>

        {/* CTA */}
        <button
          className="pose-card-cta"
          onClick={() => navigate(`/session/${id}`)}
          aria-label={`Start session for ${name}`}
        >
          <Play size={13} fill="currentColor" aria-hidden="true" />
          Start session
          <ArrowRight size={14} className="cta-arrow" aria-hidden="true" />
        </button>

      </div>
    </article>
  );
}

export default Sessions;
