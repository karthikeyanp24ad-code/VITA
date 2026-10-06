import { useState, useCallback, useId } from "react";
import {
  Camera,
  Activity,
  Sparkles,
  LayoutGrid,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import "../styles/settings.css";

/* ── camera check states ── */
const CAM_IDLE      = "idle";
const CAM_CHECKING  = "checking";
const CAM_OK        = "ok";
const CAM_DENIED    = "denied";
const CAM_UNAVAIL   = "unavailable";

export default function Settings() {
  /* camera */
  const [camState,  setCamState]  = useState(CAM_IDLE);

  /* demo mode toggle */
  const demoToggleId = useId();
  const [demoMode,  setDemoMode]  = useState(false);

  /* saved flash */
  const [saved, setSaved] = useState(false);

  /* ── check camera ── */
  const handleCheckCamera = useCallback(async () => {
    setCamState(CAM_CHECKING);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach(t => t.stop());   // release immediately
      setCamState(CAM_OK);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCamState(CAM_DENIED);
      } else {
        setCamState(CAM_UNAVAIL);
      }
    }
  }, []);

  /* ── save (demo flag) ── */
  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  /* ── camera status helpers ── */
  const camLabel = {
    [CAM_IDLE]:     null,
    [CAM_CHECKING]: "Checking…",
    [CAM_OK]:       "Camera ready",
    [CAM_DENIED]:   "Access denied",
    [CAM_UNAVAIL]:  "Not available",
  }[camState];

  const camColor = {
    [CAM_OK]:      "#5f9e7a",
    [CAM_DENIED]:  "#b85858",
    [CAM_UNAVAIL]: "#b89040",
  }[camState] ?? null;

  return (
    <div className="settings-page">

      {/* ── PAGE HEADER ── */}
      <section className="settings-header">
        <div className="settings-eyebrow">YOUR APP, YOUR CHOICES</div>
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">
          Check device readiness and choose how you practice.
        </p>
      </section>

      {/* ── SETTINGS CARD ── */}
      <div className="settings-card" role="list" aria-label="App settings">

        {/* ━━ 1. Camera access ━━ */}
        <div className="setting-row" role="listitem">
          <div className="setting-icon-wrap setting-icon-wrap--blue" aria-hidden="true">
            <Camera size={18} />
          </div>

          <div className="setting-body">
            <h2 className="setting-title">Camera access</h2>
            <p className="setting-desc">
              Your browser will ask permission when you start a live session.
            </p>

            {camLabel && (
              <p
                className="setting-status-line"
                style={{ color: camColor }}
                aria-live="polite"
              >
                {camState === CAM_OK      && <CheckCircle2 size={13} />}
                {camState === CAM_DENIED  && <XCircle      size={13} />}
                {camState === CAM_UNAVAIL && <AlertTriangle size={13} />}
                {camState === CAM_CHECKING && <Loader2 size={13} className="spin" />}
                {camLabel}
              </p>
            )}
          </div>

          <button
            className="setting-action-btn"
            onClick={handleCheckCamera}
            disabled={camState === CAM_CHECKING}
            aria-label="Check camera access"
            aria-busy={camState === CAM_CHECKING}
          >
            {camState === CAM_CHECKING ? "Checking…" : "Check camera"}
          </button>
        </div>

        <div className="setting-divider" aria-hidden="true" />

        {/* ━━ 2. Live pose model ━━ */}
        <div className="setting-row setting-row--block" role="listitem">
          <div className="setting-row-top">
            <div className="setting-icon-wrap setting-icon-wrap--purple" aria-hidden="true">
              <Activity size={18} />
            </div>

            <div className="setting-body">
              <h2 className="setting-title">Live pose model</h2>
              <p className="setting-desc">
                Random Forest loaded · YOLO11 loaded · Exact preprocessing: pending
              </p>
            </div>

            <span className="setting-badge setting-badge--amber" aria-label="Status: Gated">
              Gated
            </span>
          </div>

          <p className="setting-warning">
            Exact training-time YOLO11 keypoint normalisation source has not been supplied.
            Random Forest classification is intentionally gated; no inferred transform is used.
          </p>
        </div>

        <div className="setting-divider" aria-hidden="true" />

        {/* ━━ 3. Demo Mode ━━ */}
        <div className="setting-row" role="listitem">
          <div className="setting-icon-wrap setting-icon-wrap--violet" aria-hidden="true">
            <Sparkles size={18} />
          </div>

          <div className="setting-body">
            <h2 className="setting-title">Demo Mode</h2>
            <p className="setting-desc">
              Timer-only practice when the camera or model is unavailable.
              Demo Mode never displays pose predictions.
            </p>
          </div>

          {/* accessible toggle switch */}
          <div className="setting-toggle-wrap">
            <label
              htmlFor={demoToggleId}
              className="sr-only"
            >
              Enable Demo Mode
            </label>
            <button
              id={demoToggleId}
              role="switch"
              aria-checked={demoMode}
              aria-label="Enable Demo Mode"
              className={`setting-toggle${demoMode ? " setting-toggle--on" : ""}`}
              onClick={() => setDemoMode(v => !v)}
            >
              <span className="setting-toggle-thumb" />
            </button>
          </div>
        </div>

        <div className="setting-divider" aria-hidden="true" />

        {/* ━━ 4. Smart Mat ━━ */}
        <div className="setting-row" role="listitem">
          <div className="setting-icon-wrap setting-icon-wrap--teal" aria-hidden="true">
            <LayoutGrid size={18} />
          </div>

          <div className="setting-body">
            <h2 className="setting-title">Smart Mat</h2>
            <p className="setting-desc">
              Not connected. Pressure, balance and stability values on this screen are
              explicitly simulated for the MVP.
            </p>
          </div>

          <span className="setting-badge setting-badge--gold" aria-label="Status: Demo data">
            <span className="badge-dot" aria-hidden="true" />
            Demo data
          </span>
        </div>

      </div>

      {/* ── SAVE BUTTON ── */}
      <div className="settings-save-row">
        <button
          className={`settings-save-btn${saved ? " settings-save-btn--saved" : ""}`}
          onClick={handleSave}
          aria-label="Save settings"
        >
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : "Save settings"}
        </button>
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="settings-disclaimer" role="note">
        <Info size={13} aria-hidden="true" />
        <span>
          YOGAMAT offers general wellness guidance and geometric posture cues, not medical
          advice. Your browser controls camera permission.
        </span>
      </div>

      {/* ── PAGE FOOTER ── */}
      <footer className="settings-footer">
        <span>YOGAMAT · Move, breathe, return.</span>
        <span>General wellness guidance · not medical care</span>
      </footer>

    </div>
  );
}
