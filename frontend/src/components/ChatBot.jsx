import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Maximize2,
  Minimize2,
} from "lucide-react";
import "../styles/chatbot.css";

const API_URL = "http://localhost:5000/api/chat";

/* =========================================================
   COMPONENT
   ========================================================= */
function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I'm your VITA Yoga Assistant 🧘",
    },
    {
      id: 2,
      sender: "bot",
      text: "Ask me anything about yoga, poses, breathing, or your practice.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* ---------------------------------------------------------
     Auto-scroll to latest message
     --------------------------------------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* ---------------------------------------------------------
     Close chat
     --------------------------------------------------------- */
  const handleClose = () => {
    setIsOpen(false);
    setIsMaximized(false);
  };

  /* ---------------------------------------------------------
     Send message to VITA backend
     --------------------------------------------------------- */
  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isTyping) {
      return;
    }

    /* Add user's message immediately */
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      /* -----------------------------------------------
         Call Express backend
         ----------------------------------------------- */

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: trimmedInput,
        }),
      });

      /* -----------------------------------------------
         Check HTTP response
         ----------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      /* -----------------------------------------------
         Add AI response
         ----------------------------------------------- */

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.answer ||
          "Sorry, I couldn't generate a response right now.",
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("VITA chatbot error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "I'm having trouble connecting to the VITA AI service right now. Please make sure the VITA backend and Ollama are running.",
      };

      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      setIsTyping(false);
    }
  };

  /* ---------------------------------------------------------
     Enter key
     --------------------------------------------------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* =====================================================
          CHAT WINDOW
          ===================================================== */}

      {isOpen && (
        <div
          className={`chatbot-window${
            isMaximized ? " chatbot-window--max" : ""
          }`}
          role="dialog"
          aria-label="VITA Yoga Assistant"
          aria-modal="true"
        >

          {/* =================================================
              HEADER
              ================================================= */}

          <div className="chatbot-header">

            <div className="chatbot-header-info">

              <div
                className="chatbot-avatar"
                aria-hidden="true"
              >
                <Bot size={20} />
              </div>

              <div>
                <h3>VITA Assistant</h3>

                <span>
                  <span
                    className="online-dot"
                    aria-hidden="true"
                  />

                  Online
                </span>
              </div>

            </div>

            <div className="chatbot-header-actions">

              {/* Maximize / Minimize */}

              <button
                className="chatbot-header-btn"
                onClick={() =>
                  setIsMaximized((value) => !value)
                }
                aria-label={
                  isMaximized
                    ? "Minimize chat"
                    : "Maximize chat"
                }
                title={
                  isMaximized
                    ? "Minimize"
                    : "Maximize"
                }
              >
                {isMaximized ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>

              {/* Close */}

              <button
                className="chatbot-header-btn"
                onClick={handleClose}
                aria-label="Close chat"
                title="Close"
              >
                <X size={18} />
              </button>

            </div>
          </div>

          {/* =================================================
              MESSAGES
              ================================================= */}

          <div
            className="chatbot-messages"
            aria-live="polite"
            aria-label="Chat messages"
          >

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`chat-message ${
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >

                {/* Bot avatar */}

                {msg.sender === "bot" && (
                  <div
                    className="message-avatar bot-message-avatar"
                    aria-hidden="true"
                  >
                    <Bot size={15} />
                  </div>
                )}

                {/* Message */}

                <div className="message-bubble">
                  {msg.text}
                </div>

                {/* User avatar */}

                {msg.sender === "user" && (
                  <div
                    className="message-avatar user-message-avatar"
                    aria-hidden="true"
                  >
                    <User size={15} />
                  </div>
                )}

              </div>
            ))}

            {/* =================================================
                TYPING INDICATOR
                ================================================= */}

            {isTyping && (
              <div
                className="chat-message bot-message"
                aria-label="Assistant is typing"
              >

                <div
                  className="message-avatar bot-message-avatar"
                  aria-hidden="true"
                >
                  <Bot size={15} />
                </div>

                <div
                  className="typing-indicator"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* =================================================
              INPUT
              ================================================= */}

          <div className="chatbot-input-area">

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about yoga…"
              aria-label="Message VITA Assistant"
              autoComplete="off"
              disabled={isTyping}
            />

            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={
                !input.trim() || isTyping
              }
              aria-label="Send message"
            >
              <Send size={18} />
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          FLOATING BUTTON
          ===================================================== */}

      <button
        className={`chatbot-floating-button${
          isOpen
            ? " chatbot-button-open"
            : ""
        }`}
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
        aria-label={
          isOpen
            ? "Close VITA Assistant"
            : "Open VITA Assistant"
        }
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </button>
    </>
  );
}

export default ChatBot;