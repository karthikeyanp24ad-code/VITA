import { useState, useId } from "react";
import {
  Video,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import "../styles/mentoring.css";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const MENTORS = [
  {
    id: "m1",
    name: "Aanya Sharma",
    title: "Hatha & Restorative Yoga",
    experience: "8 years",
    rating: 4.9,
    reviews: 124,
    specialties: ["Beginners", "Stress relief", "Flexibility"],
    bio: "Aanya brings a calm, encouraging presence to every session. She specialises in building a sustainable home practice for beginners and those returning after a break.",
    avatar: "A",
    color: "#c8a4e0",
    bg: "#f5edfb",
    available: true,
    nextSlot: "Today, 4:00 PM",
  },
  {
    id: "m2",
    name: "Rohan Patel",
    title: "Vinyasa & Alignment",
    experience: "11 years",
    rating: 4.8,
    reviews: 98,
    specialties: ["Alignment", "Strength", "Intermediate"],
    bio: "Rohan's sessions focus on the precise geometry of each pose. Expect thoughtful cues, detailed alignment feedback, and a steady pace that challenges without overwhelming.",
    avatar: "R",
    color: "#8ab4d8",
    bg: "#eaf3fb",
    available: true,
    nextSlot: "Tomorrow, 9:00 AM",
  },
  {
    id: "m3",
    name: "Priya Menon",
    title: "Yin & Mindfulness",
    experience: "6 years",
    rating: 5.0,
    reviews: 67,
    specialties: ["Yin yoga", "Breathwork", "Recovery"],
    bio: "Priya creates a quiet, unhurried container for deep stretching and breath awareness. Perfect if you need to slow down, recover, or reconnect with your body.",
    avatar: "P",
    color: "#9ecfb8",
    bg: "#e8f6f0",
    available: false,
    nextSlot: "Thu, 6:00 PM",
  },
];

/* week slots (relative to "today" Oct 7) */
const WEEK_DAYS = [
  { label: "Mon", date: "Oct 6",  slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
  { label: "Tue", date: "Oct 7",  slots: ["4:00 PM", "5:30 PM"] },
  { label: "Wed", date: "Oct 8",  slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
  { label: "Thu", date: "Oct 9",  slots: ["9:00 AM", "11:30 AM", "6:00 PM"] },
  { label: "Fri", date: "Oct 10", slots: ["8:00 AM", "1:00 PM"] },
  { label: "Sat", date: "Oct 11", slots: ["10:00 AM", "12:00 PM"] },
  { label: "Sun", date: "Oct 12", slots: [] },
];

const GOALS = [
  "Improve flexibility",
  "Build strength",
  "Stress relief & relaxation",
  "Correct alignment",
  "Establish a daily practice",
  "Recovery / rehabilitation",
  "Breathwork & mindfulness",
];

const EXPERIENCE_LEVELS = ["Complete beginner", "Some experience", "Intermediate", "Advanced"];
const SESSION_TYPES = ["Video call (Zoom)", "Video call (Google Meet)", "Phone call"];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Mentoring() {
  /* flow: pick → slots → questionnaire → confirmed */
  const [step,        setStep]        = useState("pick");      // pick | slots | questionnaire | confirmed
  const [mentor,      setMentor]      = useState(null);
  const [day,         setDay]         = useState(null);
  const [slot,        setSlot]        = useState(null);
  const [form,        setForm]        = useState({
    goal:        "",
    experience:  "",
    sessionType: SESSION_TYPES[0],
    notes:       "",
    agree:       false,
  });
  const [errors,      setErrors]      = useState({});
  const [modalMentor, setModalMentor] = useState(null);   // bio preview modal

  /* ── helpers ── */
  const setF = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const handleSelectMentor = (m) => {
    setMentor(m);
    setDay(null);
    setSlot(null);
    setStep("slots");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSlotConfirm = () => {
    if (!day || !slot) return;
    setStep("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBook = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.goal)       errs.goal       = "Please select a session goal.";
    if (!form.experience) errs.experience = "Please select your experience level.";
    if (!form.agree)      errs.agree      = "Please confirm you have read the note.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setStep("pick");
    setMentor(null);
    setDay(null);
    setSlot(null);
    setForm({ goal: "", experience: "", sessionType: SESSION_TYPES[0], notes: "", agree: false });
    setErrors({});
  };

  /* ── render ── */
  return (
    <div className="mentoring-page">

      {/* PAGE HEADER */}
      <MentoringHeader step={step} mentor={mentor} onBack={
        step === "slots"         ? () => setStep("pick")
        : step === "questionnaire" ? () => setStep("slots")
        : null
      } />

      {/* STEPS */}
      {step !== "confirmed" && (
        <StepIndicator current={step} />
      )}

      {/* ── STEP: PICK MENTOR ── */}
      {step === "pick" && (
        <PickStep
          mentors={MENTORS}
          onSelect={handleSelectMentor}
          onPreview={setModalMentor}
        />
      )}

      {/* ── STEP: PICK SLOT ── */}
      {step === "slots" && mentor && (
        <SlotsStep
          mentor={mentor}
          days={WEEK_DAYS}
          day={day}
          slot={slot}
          onDay={setDay}
          onSlot={setSlot}
          onConfirm={handleSlotConfirm}
        />
      )}

      {/* ── STEP: QUESTIONNAIRE ── */}
      {step === "questionnaire" && mentor && (
        <QuestionnaireStep
          mentor={mentor}
          day={day}
          slot={slot}
          form={form}
          errors={errors}
          setF={setF}
          onSubmit={handleBook}
        />
      )}

      {/* ── STEP: CONFIRMED ── */}
      {step === "confirmed" && mentor && (
        <ConfirmedStep
          mentor={mentor}
          day={day}
          slot={slot}
          form={form}
          onReset={handleReset}
        />
      )}

      {/* BIO MODAL */}
      {modalMentor && (
        <BioModal mentor={modalMentor} onClose={() => setModalMentor(null)} />
      )}

      {/* FOOTER */}
      <footer className="mentoring-footer">
        <span>YOGAMAT · Move, breathe, return.</span>
        <span>Booking is a future feature · sessions are placeholder only</span>
      </footer>

    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE HEADER
───────────────────────────────────────────── */
function MentoringHeader({ step, mentor, onBack }) {
  const titles = {
    pick:          "One-to-One Mentoring",
    slots:         "Choose a time",
    questionnaire: "Before your session",
    confirmed:     "You're booked.",
  };
  const subs = {
    pick:          "Find a mentor whose style matches yours. Your first session is a conversation.",
    slots:         mentor ? `Booking with ${mentor.name} · pick a day and time that works for you.` : "",
    questionnaire: "A few quick questions help your mentor prepare for you.",
    confirmed:     "Your session is reserved. Check your link below.",
  };

  return (
    <section className="mentoring-header">
      {onBack && (
        <button className="mentoring-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={15} />
          Back
        </button>
      )}
      <div className="mentoring-eyebrow">PERSONALISED GUIDANCE</div>
      <h1 className="mentoring-title">{titles[step]}</h1>
      <p className="mentoring-subtitle">{subs[step]}</p>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────── */
const STEPS = [
  { key: "pick",          label: "Choose mentor" },
  { key: "slots",         label: "Pick a time" },
  { key: "questionnaire", label: "Quick check-in" },
];

function StepIndicator({ current }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="step-indicator" aria-label="Booking steps" role="list">
      {STEPS.map((s, i) => (
        <div
          key={s.key}
          className={`step-item${i < idx ? " step-item--done" : ""}${i === idx ? " step-item--active" : ""}`}
          role="listitem"
          aria-current={i === idx ? "step" : undefined}
        >
          <div className="step-circle" aria-hidden="true">
            {i < idx ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
          </div>
          <span className="step-label">{s.label}</span>
          {i < STEPS.length - 1 && <div className="step-line" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 1 — PICK MENTOR
───────────────────────────────────────────── */
function PickStep({ mentors, onSelect, onPreview }) {
  return (
    <div className="pick-step">
      <div className="mentor-grid">
        {mentors.map(m => (
          <MentorCard
            key={m.id}
            mentor={m}
            onSelect={onSelect}
            onPreview={onPreview}
          />
        ))}
      </div>

      {/* info note */}
      <div className="mentoring-note">
        <AlertCircle size={13} />
        <span>
          This is a future feature. Mentor profiles and booking slots are illustrative
          placeholders. No real session will be scheduled.
        </span>
      </div>
    </div>
  );
}

function MentorCard({ mentor, onSelect, onPreview }) {
  const { name, title, experience, rating, reviews, specialties, avatar, color, bg, available, nextSlot } = mentor;
  return (
    <article
      className="mentor-card"
      aria-label={`Mentor: ${name}`}
    >
      {/* avatar */}
      <div className="mentor-card-top">
        <div className="mentor-avatar" style={{ background: bg, color }} aria-hidden="true">
          {avatar}
        </div>
        <div className="mentor-avail">
          <span className={`avail-dot${available ? " avail-dot--on" : ""}`} aria-hidden="true" />
          <span>{available ? "Available" : "Next slot soon"}</span>
        </div>
      </div>

      {/* info */}
      <h2 className="mentor-name">{name}</h2>
      <p className="mentor-title-text">{title}</p>

      {/* rating */}
      <div className="mentor-rating" aria-label={`Rating: ${rating} out of 5, ${reviews} reviews`}>
        <Star size={13} fill="#f0b740" color="#f0b740" aria-hidden="true" />
        <span className="rating-num">{rating}</span>
        <span className="rating-reviews">({reviews} reviews)</span>
        <span className="mentor-exp">{experience}</span>
      </div>

      {/* specialties */}
      <div className="mentor-specialties" aria-label="Specialties">
        {specialties.map(s => (
          <span key={s} className="specialty-tag">{s}</span>
        ))}
      </div>

      {/* next slot */}
      <div className="mentor-next-slot">
        <Clock size={12} aria-hidden="true" />
        <span>Next available: <strong>{nextSlot}</strong></span>
      </div>

      {/* actions */}
      <div className="mentor-card-actions">
        <button
          className="mentor-btn mentor-btn--outline"
          onClick={() => onPreview(mentor)}
          aria-label={`View ${name}'s profile`}
        >
          View profile
        </button>
        <button
          className="mentor-btn mentor-btn--primary"
          onClick={() => onSelect(mentor)}
          aria-label={`Book a session with ${name}`}
        >
          Book session
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   STEP 2 — SLOT PICKER
───────────────────────────────────────────── */
function SlotsStep({ mentor, days, day, slot, onDay, onSlot, onConfirm }) {
  const canConfirm = day !== null && slot !== null;

  return (
    <div className="slots-step">

      {/* selected mentor pill */}
      <div className="selected-mentor-pill">
        <div className="smp-avatar" style={{ background: mentor.bg, color: mentor.color }}>
          {mentor.avatar}
        </div>
        <div>
          <span className="smp-name">{mentor.name}</span>
          <span className="smp-title">{mentor.title}</span>
        </div>
      </div>

      {/* week grid */}
      <div className="week-grid" role="group" aria-label="Select a day">
        {days.map((d, i) => (
          <button
            key={i}
            className={`week-day${day === i ? " week-day--selected" : ""}${d.slots.length === 0 ? " week-day--empty" : ""}`}
            onClick={() => { if (d.slots.length > 0) { onDay(i); onSlot(null); } }}
            disabled={d.slots.length === 0}
            aria-pressed={day === i}
            aria-label={`${d.label} ${d.date}, ${d.slots.length === 0 ? "no slots" : d.slots.length + " slots available"}`}
          >
            <span className="wd-label">{d.label}</span>
            <span className="wd-date">{d.date}</span>
            <span className="wd-count">
              {d.slots.length === 0 ? "—" : `${d.slots.length} slot${d.slots.length > 1 ? "s" : ""}`}
            </span>
          </button>
        ))}
      </div>

      {/* time slots */}
      {day !== null && (
        <div className="time-slots" role="group" aria-label="Select a time slot">
          <p className="ts-heading">
            <Clock size={14} aria-hidden="true" />
            Available times on <strong>{days[day].label}, {days[day].date}</strong>
          </p>
          <div className="ts-grid">
            {days[day].slots.map((s, i) => (
              <button
                key={i}
                className={`ts-btn${slot === s ? " ts-btn--selected" : ""}`}
                onClick={() => onSlot(s)}
                aria-pressed={slot === s}
                aria-label={`Select ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* confirm */}
      <div className="slots-confirm-row">
        {canConfirm && (
          <p className="confirm-selection" aria-live="polite">
            <CheckCircle2 size={14} aria-hidden="true" />
            {days[day].label}, {days[day].date} · {slot} · {mentor.name}
          </p>
        )}
        <button
          className="mentoring-primary-btn"
          onClick={onConfirm}
          disabled={!canConfirm}
          aria-label="Confirm time slot and continue"
          aria-disabled={!canConfirm}
        >
          Continue
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 3 — QUESTIONNAIRE
───────────────────────────────────────────── */
function QuestionnaireStep({ mentor, day, slot, form, errors, setF, onSubmit }) {
  const goalId   = useId();
  const expId    = useId();
  const typeId   = useId();
  const notesId  = useId();
  const agreeId  = useId();

  return (
    <div className="questionnaire-step">

      {/* booking summary banner */}
      <div className="booking-summary">
        <div className="bs-left">
          <div className="bs-avatar" style={{ background: mentor.bg, color: mentor.color }}>
            {mentor.avatar}
          </div>
          <div>
            <p className="bs-name">{mentor.name}</p>
            <p className="bs-meta">{mentor.title}</p>
          </div>
        </div>
        <div className="bs-right">
          <div className="bs-detail">
            <Calendar size={13} aria-hidden="true" />
            <span>{day !== null ? `${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][day]}, Oct ${7 + day}` : ""}</span>
          </div>
          <div className="bs-detail">
            <Clock size={13} aria-hidden="true" />
            <span>{slot}</span>
          </div>
        </div>
      </div>

      {/* form */}
      <form
        className="questionnaire-form"
        onSubmit={onSubmit}
        noValidate
        aria-label="Pre-session questionnaire"
      >

        {/* goal */}
        <div className="qf-field">
          <label htmlFor={goalId} className="qf-label">
            What's your main goal for this session?
            <span className="qf-required" aria-hidden="true">*</span>
          </label>
          <select
            id={goalId}
            className={`qf-select${errors.goal ? " qf-select--error" : ""}`}
            value={form.goal}
            onChange={setF("goal")}
            aria-required="true"
            aria-describedby={errors.goal ? `${goalId}-err` : undefined}
          >
            <option value="">Select a goal…</option>
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.goal && (
            <p id={`${goalId}-err`} className="qf-error" role="alert">{errors.goal}</p>
          )}
        </div>

        {/* experience */}
        <div className="qf-field">
          <label htmlFor={expId} className="qf-label">
            How would you describe your yoga experience?
            <span className="qf-required" aria-hidden="true">*</span>
          </label>
          <div
            className="qf-radio-group"
            role="radiogroup"
            aria-label="Yoga experience level"
            aria-describedby={errors.experience ? `${expId}-err` : undefined}
          >
            {EXPERIENCE_LEVELS.map(lvl => (
              <label
                key={lvl}
                className={`qf-radio-label${form.experience === lvl ? " qf-radio-label--selected" : ""}`}
              >
                <input
                  type="radio"
                  name="experience"
                  value={lvl}
                  checked={form.experience === lvl}
                  onChange={setF("experience")}
                  className="qf-radio-input"
                  aria-checked={form.experience === lvl}
                />
                {lvl}
              </label>
            ))}
          </div>
          {errors.experience && (
            <p id={`${expId}-err`} className="qf-error" role="alert">{errors.experience}</p>
          )}
        </div>

        {/* session type */}
        <div className="qf-field">
          <label htmlFor={typeId} className="qf-label">Preferred session format</label>
          <select
            id={typeId}
            className="qf-select"
            value={form.sessionType}
            onChange={setF("sessionType")}
          >
            {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* notes */}
        <div className="qf-field">
          <label htmlFor={notesId} className="qf-label">
            Anything else your mentor should know? <span className="qf-optional">(optional)</span>
          </label>
          <textarea
            id={notesId}
            className="qf-textarea"
            rows={4}
            placeholder="e.g. lower back sensitivity, preferred pace, specific poses you'd like help with…"
            value={form.notes}
            onChange={setF("notes")}
            maxLength={500}
          />
          <span className="qf-char-count" aria-live="polite">{form.notes.length} / 500</span>
        </div>

        {/* agree */}
        <label
          htmlFor={agreeId}
          className={`qf-checkbox-label${errors.agree ? " qf-checkbox-label--error" : ""}`}
        >
          <input
            id={agreeId}
            type="checkbox"
            checked={form.agree}
            onChange={setF("agree")}
            className="qf-checkbox"
            aria-required="true"
            aria-describedby={errors.agree ? `${agreeId}-err` : undefined}
          />
          <span>
            I understand this is a placeholder booking for a future feature and no real
            session will be scheduled at this time.
          </span>
        </label>
        {errors.agree && (
          <p id={`${agreeId}-err`} className="qf-error" role="alert">{errors.agree}</p>
        )}

        {/* submit */}
        <div className="qf-actions">
          <button
            type="submit"
            className="mentoring-primary-btn"
            aria-label="Confirm booking"
          >
            Confirm booking
            <CheckCircle2 size={15} aria-hidden="true" />
          </button>
        </div>

      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP 4 — CONFIRMED
───────────────────────────────────────────── */
function ConfirmedStep({ mentor, day, slot, form, onReset }) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const linkLabel = form.sessionType.includes("Meet") ? "Google Meet" : "Zoom";
  const linkUrl   = form.sessionType.includes("Meet")
    ? "https://meet.google.com"
    : "https://zoom.us";

  return (
    <div className="confirmed-step">

      {/* check */}
      <div className="confirmed-icon" aria-hidden="true">
        <CheckCircle2 size={36} />
      </div>

      <h2 className="confirmed-heading">Session reserved!</h2>
      <p className="confirmed-sub">
        Your mentor will receive your answers and reach out to confirm the call link
        before your session.
      </p>

      {/* summary card */}
      <div className="confirmed-card">

        <div className="confirmed-mentor-row">
          <div className="conf-avatar" style={{ background: mentor.bg, color: mentor.color }}>
            {mentor.avatar}
          </div>
          <div>
            <p className="conf-name">{mentor.name}</p>
            <p className="conf-title">{mentor.title}</p>
          </div>
        </div>

        <div className="conf-details">
          <div className="conf-detail-row">
            <Calendar size={14} aria-hidden="true" />
            <span>{day !== null ? `${days[day]}, Oct ${7 + day}` : ""}</span>
          </div>
          <div className="conf-detail-row">
            <Clock size={14} aria-hidden="true" />
            <span>{slot} · 60 min</span>
          </div>
          <div className="conf-detail-row">
            <Video size={14} aria-hidden="true" />
            <span>{form.sessionType}</span>
          </div>
          <div className="conf-detail-row">
            <Sparkles size={14} aria-hidden="true" />
            <span>{form.goal}</span>
          </div>
        </div>

        {/* video call placeholder */}
        <div className="video-call-placeholder">
          <div className="vcp-icon" aria-hidden="true">
            <Video size={22} />
          </div>
          <div className="vcp-body">
            <p className="vcp-title">Your {linkLabel} link</p>
            <p className="vcp-sub">
              A personalised link will be sent by your mentor before the session.
              This is a placeholder link for demo purposes only.
            </p>
          </div>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vcp-link-btn"
            aria-label={`Open ${linkLabel} (placeholder link, opens in new tab)`}
          >
            Open {linkLabel}
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>

      </div>

      {/* actions */}
      <div className="confirmed-actions">
        <button
          className="mentoring-secondary-btn"
          onClick={onReset}
          aria-label="Book another session"
        >
          Book another session
        </button>
      </div>

      {/* disclaimer */}
      <div className="confirmed-disclaimer">
        <AlertCircle size={13} aria-hidden="true" />
        <span>
          This booking is a UI demonstration only. No real session is scheduled,
          no data is sent externally, and the video link is a placeholder.
        </span>
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   BIO MODAL
───────────────────────────────────────────── */
function BioModal({ mentor, onClose }) {
  return (
    <div
      className="bio-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${mentor.name}'s profile`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bio-modal">

        {/* close */}
        <button
          className="bio-modal-close"
          onClick={onClose}
          aria-label="Close profile"
        >
          <X size={18} />
        </button>

        {/* header */}
        <div className="bio-modal-header">
          <div
            className="bio-avatar"
            style={{ background: mentor.bg, color: mentor.color }}
            aria-hidden="true"
          >
            {mentor.avatar}
          </div>
          <div>
            <h2 className="bio-name">{mentor.name}</h2>
            <p className="bio-title">{mentor.title}</p>
            <div className="bio-rating" aria-label={`${mentor.rating} stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.round(mentor.rating) ? "#f0b740" : "#e0d8e8"}
                  color={i < Math.round(mentor.rating) ? "#f0b740" : "#e0d8e8"}
                  aria-hidden="true"
                />
              ))}
              <span className="bio-rating-num">{mentor.rating} · {mentor.reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* bio */}
        <p className="bio-text">{mentor.bio}</p>

        {/* details */}
        <div className="bio-details">
          <div className="bio-detail-item">
            <span className="bio-detail-label">Experience</span>
            <span className="bio-detail-val">{mentor.experience}</span>
          </div>
          <div className="bio-detail-item">
            <span className="bio-detail-label">Specialties</span>
            <div className="bio-specialties">
              {mentor.specialties.map(s => (
                <span key={s} className="specialty-tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="bio-detail-item">
            <span className="bio-detail-label">Next available</span>
            <span className="bio-detail-val" style={{ color: "#5f9e7a", fontWeight: 600 }}>
              {mentor.nextSlot}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="mentoring-primary-btn bio-modal-cta"
          onClick={onClose}
          aria-label={`Close and book with ${mentor.name}`}
        >
          Close
        </button>

      </div>
    </div>
  );
}
