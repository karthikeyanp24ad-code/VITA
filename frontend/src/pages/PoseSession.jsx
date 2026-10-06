import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Camera,
  CameraOff,
  Play,
  Square,
  RotateCcw,
  X,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
} from "lucide-react";

import "../styles/posesession.css";

/* ── pose metadata (mirrors Sessions.jsx) ── */
const POSE_DATA = {
  "01": {
    name: "Anantasana",
    level: "Intermediate",
    duration: 8,
    focus: "Balance · hip mobility",
    description: "A side-reclining balance that invites length through the whole body.",
    cue: "Let your breath set the pace.",
    tips: [
      "Root your bottom hip firmly into the mat.",
      "Extend through your top heel as you lift.",
      "Keep your gaze soft and forward.",
    ],
  },
  "02": {
    name: "Bhujangasana",
    level: "Beginner",
    duration: 6,
    focus: "Chest · gentle extension",
    description: "A gentle, supported backbend that opens the front of the body.",
    cue: "Open your chest with each inhale.",
    tips: [
      "Press the tops of your feet into the mat.",
      "Keep elbows slightly bent, shoulders away from ears.",
      "Gaze forward or slightly upward.",
    ],
  },
  "03": {
    name: "Marjariasana",
    level: "Beginner",
    duration: 7,
    focus: "Spine · mobility",
    description: "A grounding hands-and-knees shape for slow spinal movement.",
    cue: "Move with your breath, not against it.",
    tips: [
      "Stack wrists under shoulders, knees under hips.",
      "Round your spine fully on the exhale.",
      "Let the movement be slow and intentional.",
    ],
  },
  "04": {
    name: "Trikonasana",
    level: "Intermediate",
    duration: 8,
    focus: "Balance · side body",
    description: "A wide, steady triangle with space through both sides of the torso.",
    cue: "Find length before you find depth.",
    tips: [
      "Ground through the outer edge of your back foot.",
      "Reach your top arm directly above your shoulder.",
      "Keep both sides of the waist long.",
    ],
  },
  "05": {
    name: "Vajrasana",
    level: "Beginner",
    duration: 5,
    focus: "Balance · breath",
    description: "A quiet kneeling seat for steady posture and a calmer breath.",
    cue: "Settle into stillness.",
    tips: [
      "Sit on your heels with spine tall.",
      "Rest hands on thighs, palms down.",
      "Soften your jaw and shoulders.",
    ],
  },
  "06": {
    name: "Virabhadrasana I",
    level: "Intermediate",
    duration: 8,
    focus: "Strength · grounding",
    description: "A grounded standing lunge with an expansive, upright reach.",
    cue: "Root down to rise up.",
    tips: [
      "Square your hips toward the front of the mat.",
      "Bend your front knee to 90° over the ankle.",
      "Reach both arms strongly overhead.",
    ],
  },
};

/* ── demo alignment scores cycle ── */
const DEMO_SCORES = [72, 78, 81, 75, 84, 88, 82, 79, 86, 90, 85, 83];

/* ── format seconds → MM:SS ── */
function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function PoseSession() {
  const { poseId } = useParams();
  const navigate   = useNavigate();
  const pose       = POSE_DATA[poseId] ?? POSE_DATA["01"];

  /* ── camera / demo state ── */
  const [cameraState, setCameraState]   = useState("off");   // off | requesting | active | denied
  const [demoMode,    setDemoMode]      = useState(false);
  const [running,     setRunning]       = useState(false);
  const [elapsed,     setElapsed]       = useState(0);
  const [demoScore,   setDemoScore]     = useState(null);
  const [demoIdx,     setDemoIdx]       = useState(0);
  const [detectedPose, setDetectedPose] = useState(null);

  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const timerRef    = useRef(null);
  const demoRef     = useRef(null);

  /* ── cleanup on unmount ── */
  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
      clearInterval(demoRef.current);
    };
  }, []);

  /* ── timer ── */
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  /* ── demo score cycle ── */
  useEffect(() => {
    if (demoMode && running) {
      demoRef.current = setInterval(() => {
        setDemoIdx(i => (i + 1) % DEMO_SCORES.length);
        setDemoScore(DEMO_SCORES[demoIdx]);
        setDetectedPose(pose.name);
      }, 1800);
    } else {
      clearInterval(demoRef.current);
      if (!demoMode) {
        setDemoScore(null);
        setDetectedPose(null);
      }
    }
    return () => clearInterval(demoRef.current);
  }, [demoMode, running, demoIdx, pose.name]);

  /* ── camera helpers ── */
  const startCamera = useCallback(async () => {
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("active");
    } catch {
      setCameraState("denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraState("off");
  }, []);

  /* ── button handlers ── */
  const handleStartLive = useCallback(async () => {
    setDemoMode(false);
    await startCamera();
    setRunning(true);
  }, [startCamera]);

  const handleTryDemo = useCallback(() => {
    stopCamera();
    setDemoMode(true);
    setRunning(true);
    setDemoScore(DEMO_SCORES[0]);
    setDetectedPose(pose.name);
  }, [stopCamera, pose.name]);

  const handleStop = useCallback(() => {
    setRunning(false);
    setDemoMode(false);
    stopCamera();
    setElapsed(0);
    setDemoScore(null);
    setDetectedPose(null);
    setDemoIdx(0);
  }, [stopCamera]);

  const handleCancel = useCallback(() => {
    handleStop();
    navigate("/sessions");
  }, [handleStop, navigate]);

  /* ── derived ── */
  const isLive    = cameraState === "active";
  const isRunning = running;
  const scoreVal  = demoScore ?? null;
  const scoreLbl  =
    scoreVal === null ? "—"
    : scoreVal >= 85  ? "Good"
    : scoreVal >= 70  ? "Fair"
    : "Needs work";
  const scoreColor =
    scoreVal === null ? "#9b93a5"
    : scoreVal >= 85  ? "#5f9e7a"
    : scoreVal >= 70  ? "#b59640"
    : "#b05858";

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="ps-page">

      {/* ── PAGE HEADER ── */}
      <div className="ps-header">
        <div className="ps-header-left">
          <button
            className="ps-back-btn"
            onClick={handleCancel}
            aria-label="Back to Yoga Sessions"
          >
            <ChevronLeft size={16} />
            Yoga sessions
          </button>

          <div className="ps-eyebrow">A LITTLE SPACE, JUST FOR YOU</div>
          <h1 className="ps-title">Live session</h1>
          <p className="ps-subtitle">
            Today's focus: <strong>{pose.name}</strong>. {pose.cue}
          </p>
        </div>

        <button
          className="ps-cancel-btn"
          onClick={handleCancel}
          aria-label="Cancel session and return"
        >
          <X size={15} />
          Cancel all
        </button>
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <div className="ps-body">

        {/* ══ LEFT — camera panel ══ */}
        <div className="ps-camera-panel">

          {/* camera viewport */}
          <div className="ps-viewport" aria-label="Camera viewport">

            {/* status bar */}
            <div className="ps-viewport-bar">
              <div className="ps-cam-status">
                {isLive
                  ? <><span className="ps-cam-dot ps-cam-dot--live" /><span>Camera live</span></>
                  : demoMode
                  ? <><span className="ps-cam-dot ps-cam-dot--demo" /><span>Demo mode</span></>
                  : <><CameraOff size={13} /><span>Camera off</span></>
                }
              </div>
              <span className="ps-frames-note">
                {isLive ? "Frames are not stored" : "Camera frames are not stored"}
              </span>
            </div>

            {/* video element (live) */}
            <video
              ref={videoRef}
              className={`ps-video${isLive ? " ps-video--visible" : ""}`}
              muted
              playsInline
              aria-label="Live camera feed"
            />

            {/* idle / demo placeholder */}
            {!isLive && (
              <div className={`ps-idle${demoMode ? " ps-idle--demo" : ""}`}>
                {demoMode ? (
                  <>
                    <div className="ps-demo-badge">
                      <Zap size={22} />
                    </div>
                    <p className="ps-idle-title">Demo mode active</p>
                    <p className="ps-idle-sub">
                      Simulated pose detection running · no camera required
                    </p>
                  </>
                ) : cameraState === "denied" ? (
                  <>
                    <AlertCircle size={34} className="ps-idle-icon ps-idle-icon--warn" />
                    <p className="ps-idle-title">Camera access denied</p>
                    <p className="ps-idle-sub">
                      Allow camera access in your browser settings and try again.
                    </p>
                  </>
                ) : cameraState === "requesting" ? (
                  <>
                    <div className="ps-spinner" aria-label="Requesting camera" />
                    <p className="ps-idle-title">Requesting camera…</p>
                  </>
                ) : (
                  <>
                    <Camera size={34} className="ps-idle-icon" />
                    <p className="ps-idle-title">Your space, on your terms.</p>
                    <p className="ps-idle-sub">
                      Your camera feed stays local to this session.
                      Camera access begins when you choose to start.
                    </p>
                    <p className="ps-idle-privacy">
                      <span className="ps-privacy-dot" />
                      Camera pixels never leave your device
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* controls bar */}
          <div className="ps-controls">
            <div className="ps-timer" aria-live="polite" aria-label="Session timer">
              <Clock size={14} aria-hidden="true" />
              <span className="ps-timer-digits">{fmtTime(elapsed)}</span>
              <span className="ps-timer-label">elapsed</span>
            </div>

            <div className="ps-ctrl-btns">
              {isRunning ? (
                <button
                  className="ps-btn ps-btn--stop"
                  onClick={handleStop}
                  aria-label="Stop session"
                >
                  <Square size={14} fill="currentColor" />
                  Stop session
                </button>
              ) : (
                <>
                  <button
                    className="ps-btn ps-btn--live"
                    onClick={handleStartLive}
                    aria-label="Start live session with camera"
                    disabled={cameraState === "requesting"}
                  >
                    <Play size={14} fill="currentColor" />
                    Start live session
                  </button>

                  <button
                    className="ps-btn ps-btn--demo"
                    onClick={handleTryDemo}
                    aria-label="Try demo mode without camera"
                  >
                    <Zap size={14} />
                    Try Demo Mode
                  </button>
                </>
              )}

              {(isRunning) && (
                <button
                  className="ps-btn ps-btn--reset"
                  onClick={handleStop}
                  aria-label="Reset session"
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </div>

          {/* camera note */}
          <p className="ps-cam-note">
            {isLive
              ? "Camera is live. Your feed never leaves this tab."
              : cameraState === "denied"
              ? "Camera access was denied. Enable it in browser settings."
              : "Camera is off. Start when your space feels ready."}
          </p>

        </div>

        {/* ══ RIGHT — info panel ══ */}
        <div className="ps-info-panel">

          {/* pose header */}
          <div className="ps-pose-header">
            <span className="ps-panel-label">CURRENT POSE</span>

            {isRunning && (
              <span className="ps-running-badge">
                <span className="ps-run-dot" />
                {demoMode ? "Demo" : "Live"}
              </span>
            )}
          </div>

          <h2 className="ps-pose-name">{pose.name}</h2>
          <p className="ps-pose-desc">{pose.description}</p>

          <div className="ps-pose-focus">
            <span className="ps-focus-dot" />
            {pose.focus}
          </div>

          {/* ── alignment signal card ── */}
          <div className="ps-alignment-card">
            <div className="ps-alignment-label">ALIGNMENT SIGNAL</div>

            {scoreVal !== null ? (
              <div className="ps-score-row">
                <div className="ps-score-bar-wrap" aria-label={`Alignment score ${scoreVal}%`}>
                  <div
                    className="ps-score-bar-fill"
                    style={{ width: `${scoreVal}%`, background: scoreColor }}
                  />
                </div>
                <span className="ps-score-num" style={{ color: scoreColor }}>
                  {scoreVal}%
                </span>
                <span className="ps-score-lbl" style={{ color: scoreColor }}>
                  {scoreLbl}
                </span>
              </div>
            ) : (
              <p className="ps-alignment-placeholder">
                Gentle geometry feedback appears when your body is detected.
              </p>
            )}

            <p className="ps-alignment-note">
              Geometric skeleton only · not a diagnosis or accuracy claim
            </p>
          </div>

          {/* ── detection card ── */}
          <div className="ps-detection-card">
            <div className="ps-panel-label">DETECTION</div>

            <div className="ps-detection-row">
              <div className={`ps-detect-icon${detectedPose ? " ps-detect-icon--active" : ""}`}>
                <Activity size={16} />
              </div>
              <div>
                <p className="ps-detect-title">
                  {detectedPose ? `Detected: ${detectedPose}` : "Person detection"}
                </p>
                <p className="ps-detect-sub">
                  {detectedPose
                    ? "Pose recognised · alignment active"
                    : "Starts when camera or demo begins"}
                </p>
              </div>
            </div>

            <div className="ps-detect-status">
              <span className="ps-detect-lbl">Frame quality</span>
              <span className="ps-detect-val">
                {isLive ? "Live feed" : demoMode ? "Simulated" : "Waiting for camera"}
              </span>
            </div>

            {!isRunning && (
              <div className="ps-no-label-note">
                <AlertCircle size={13} />
                <span>
                  Why no pose label yet? The preprocessing → Random Forest pipeline
                  activates once you start a session.
                </span>
              </div>
            )}
          </div>

          {/* ── tips ── */}
          <div className="ps-tips-card">
            <div className="ps-panel-label">PRACTICE TIPS</div>
            <ul className="ps-tips-list">
              {pose.tips.map((tip, i) => (
                <li key={i} className="ps-tip-item">
                  <CheckCircle2 size={13} className="ps-tip-icon" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── bottom privacy note ── */}
      <div className="ps-privacy-bar">
        <AlertCircle size={12} />
        <span>
          Your session is local only to this window. Camera access stops when you leave or finish.
        </span>
        {isLive && (
          <button className="ps-turn-off-cam" onClick={stopCamera}>
            Turn off camera
          </button>
        )}
      </div>

    </div>
  );
}
