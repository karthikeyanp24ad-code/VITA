import { useState } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import "../styles/profile.css";

/* ── initial form state ── */
const INITIAL = {
  name:           "",
  age:            "",
  gender:         "Prefer not to say",
  height:         "",
  weight:         "",
  fitnessGoal:    "General wellness",
  activityLevel:  "Lightly active",
  dietPreference: "Other",
  yogaExperience: "Beginner",
  exerciseTarget: 30,
};

const GENDER_OPTIONS        = ["Prefer not to say", "Female", "Male", "Non-binary", "Other"];
const FITNESS_GOAL_OPTIONS  = ["General wellness", "Weight loss", "Muscle tone", "Flexibility", "Stress relief", "Rehabilitation"];
const ACTIVITY_OPTIONS      = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Athlete"];
const DIET_OPTIONS          = ["No preference", "Vegetarian", "Vegan", "Gluten-free", "Keto", "Other"];
const EXPERIENCE_OPTIONS    = ["Beginner", "Some experience", "Intermediate", "Advanced"];

export default function Profile() {
  const [form,    setForm]    = useState(INITIAL);
  const [saved,   setSaved]   = useState(false);
  const [errors,  setErrors]  = useState({});

  /* ── field helpers ── */
  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: undefined }));
    setSaved(false);
  };

  const setSlider = (e) =>
    setForm(f => ({ ...f, exerciseTarget: Number(e.target.value) }));

  /* ── save ── */
  const handleSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) {
      errs.age = "Please enter a valid age (1–120).";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ── slider fill % ── */
  const sliderPct = Math.round(((form.exerciseTarget - 5) / (170 - 5)) * 100);

  return (
    <div className="profile-page">

      {/* ── PAGE HEADER ── */}
      <section className="profile-header">
        <div className="profile-eyebrow">A PRACTICE THAT FITS YOU</div>
        <h1 className="profile-title">Your profile</h1>
        <p className="profile-subtitle">
          A little context helps your coach meet you where you are.
        </p>
      </section>

      {/* ── TWO-COLUMN BODY ── */}
      <div className="profile-body">

        {/* ══ LEFT — form card ══ */}
        <form
          className="profile-card"
          onSubmit={handleSave}
          noValidate
          aria-label="Profile form"
        >
          {/* card header */}
          <div className="profile-card-header">
            <div className="profile-avatar" aria-hidden="true">Y</div>
            <div>
              <h2 className="profile-card-title">Your details</h2>
              <p className="profile-card-sub">
                Only used to personalise your practice in this app.
              </p>
            </div>
          </div>

          <div className="profile-divider" />

          {/* ── Name ── */}
          <div className="pf-field pf-field--full">
            <label htmlFor="pf-name" className="pf-label">Name</label>
            <input
              id="pf-name"
              type="text"
              className="pf-input"
              placeholder="How should we greet you?"
              value={form.name}
              onChange={set("name")}
              autoComplete="given-name"
            />
          </div>

          {/* ── Age + Gender ── */}
          <div className="pf-row">
            <div className="pf-field">
              <div className="pf-label-row">
                <label htmlFor="pf-age" className="pf-label">Age</label>
                <span className="pf-badge pf-badge--required">Required</span>
              </div>
              <input
                id="pf-age"
                type="number"
                className={`pf-input${errors.age ? " pf-input--error" : ""}`}
                placeholder="Your age"
                value={form.age}
                onChange={set("age")}
                min="1"
                max="120"
                inputMode="numeric"
                aria-required="true"
                aria-describedby={errors.age ? "pf-age-error" : undefined}
              />
              {errors.age && (
                <p id="pf-age-error" className="pf-error" role="alert">{errors.age}</p>
              )}
            </div>

            <div className="pf-field">
              <div className="pf-label-row">
                <label htmlFor="pf-gender" className="pf-label">Gender</label>
                <span className="pf-badge">Optional</span>
              </div>
              <select
                id="pf-gender"
                className="pf-select"
                value={form.gender}
                onChange={set("gender")}
              >
                {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Height + Weight ── */}
          <div className="pf-row">
            <div className="pf-field">
              <div className="pf-label-row">
                <label htmlFor="pf-height" className="pf-label">Height</label>
                <span className="pf-badge">Optional</span>
              </div>
              <div className="pf-input-unit">
                <input
                  id="pf-height"
                  type="number"
                  className="pf-input"
                  placeholder="—"
                  value={form.height}
                  onChange={set("height")}
                  min="50"
                  max="250"
                  inputMode="numeric"
                  aria-label="Height in centimetres"
                />
                <span className="pf-unit">cm</span>
              </div>
            </div>

            <div className="pf-field">
              <div className="pf-label-row">
                <label htmlFor="pf-weight" className="pf-label">Weight</label>
                <span className="pf-badge">Optional</span>
              </div>
              <div className="pf-input-unit">
                <input
                  id="pf-weight"
                  type="number"
                  className="pf-input"
                  placeholder="—"
                  value={form.weight}
                  onChange={set("weight")}
                  min="20"
                  max="300"
                  inputMode="numeric"
                  aria-label="Weight in kilograms"
                />
                <span className="pf-unit">kg</span>
              </div>
            </div>
          </div>

          {/* ── Your practice ── */}
          <div className="pf-section-label">
            <span className="pf-section-icon" aria-hidden="true">✦</span>
            Your practice
          </div>

          {/* ── Fitness goal + Activity level ── */}
          <div className="pf-row">
            <div className="pf-field">
              <label htmlFor="pf-fitness" className="pf-label">Fitness goal</label>
              <select id="pf-fitness" className="pf-select" value={form.fitnessGoal} onChange={set("fitnessGoal")}>
                {FITNESS_GOAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="pf-field">
              <label htmlFor="pf-activity" className="pf-label">Activity level</label>
              <select id="pf-activity" className="pf-select" value={form.activityLevel} onChange={set("activityLevel")}>
                {ACTIVITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Diet + Yoga experience ── */}
          <div className="pf-row">
            <div className="pf-field">
              <label htmlFor="pf-diet" className="pf-label">Diet preference</label>
              <select id="pf-diet" className="pf-select" value={form.dietPreference} onChange={set("dietPreference")}>
                {DIET_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="pf-field">
              <label htmlFor="pf-yoga" className="pf-label">Yoga experience</label>
              <select id="pf-yoga" className="pf-select" value={form.yogaExperience} onChange={set("yogaExperience")}>
                {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* ── Daily exercise target slider ── */}
          <div className="pf-field pf-field--full">
            <div className="pf-label-row pf-label-row--spread">
              <label htmlFor="pf-exercise" className="pf-label">Daily exercise target</label>
              <span className="pf-slider-val" aria-live="polite">
                {form.exerciseTarget} min
              </span>
            </div>

            <input
              id="pf-exercise"
              type="range"
              className="pf-slider"
              min="5"
              max="170"
              step="5"
              value={form.exerciseTarget}
              onChange={setSlider}
              aria-valuemin={5}
              aria-valuemax={170}
              aria-valuenow={form.exerciseTarget}
              aria-valuetext={`${form.exerciseTarget} minutes`}
              style={{ "--fill": `${sliderPct}%` }}
            />

            <div className="pf-slider-ticks" aria-hidden="true">
              <span>5 min</span>
              <span>170 min</span>
            </div>
          </div>

          {/* ── Save button ── */}
          <div className="pf-actions">
            <button
              type="submit"
              className={`pf-save-btn${saved ? " pf-save-btn--saved" : ""}`}
              aria-label="Save profile"
            >
              {saved ? (
                <><CheckCircle2 size={15} /> Saved!</>
              ) : (
                "Save profile"
              )}
            </button>
          </div>

        </form>

        {/* ══ RIGHT — info cards ══ */}
        <aside className="profile-aside" aria-label="Profile information">

          {/* privacy card */}
          <div className="profile-privacy-card">
            <div className="privacy-icon-wrap" aria-hidden="true">
              <ShieldCheck size={22} />
            </div>
            <h3 className="privacy-title">Your details stay yours.</h3>
            <p className="privacy-body">
              Your profile is stored in the app's MVP database. When you send a chat
              question, the selected practice details and questions are sent to Mentor AI.
              This app does not save chat history.
            </p>
            <div className="privacy-note">
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>Age is required for your personalised plan</span>
            </div>
          </div>

          {/* quote card */}
          <div className="profile-quote-card">
            <div className="quote-mark" aria-hidden="true">"</div>
            <blockquote className="quote-text">
              Progress isn't a finish line. It's the practice of coming back.
            </blockquote>
            <p className="quote-attr">YOGAMAT · A NOTE TO SELF</p>
          </div>

        </aside>

      </div>

    </div>
  );
}
