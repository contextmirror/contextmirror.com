import { useEffect, useRef, useState, useCallback } from "react";

/* ── Demo chat messages ─────────────────────────────────────── */
const DEMO_MESSAGES = [
  { role: "assistant", sender: "Voice Mirror", text: "Hey! I'm Voice Mirror — your AI assistant. Say \"Hey Claude\" or press the hotkey to talk. I can see your screen, run commands, and browse the web." },
  { role: "user", sender: "You", text: "What's the error on my screen?" },
  { role: "assistant", sender: "Voice Mirror", text: "I can see a TypeError in your terminal — looks like you're passing null to a function that expects a string. The fix is on line 42 of app.js. Want me to fix it?" },
  { role: "user", sender: "You", text: "Yes, fix it." },
  { role: "assistant", sender: "Voice Mirror", text: "Done! I've updated line 42 to add a null check. The tests are passing now." },
];

/* ── Sidebar nav icons (inline SVGs) ────────────────────────── */
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const TerminalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

/* ── Demo Panel Component ───────────────────────────────────── */
function DemoPanel({ onClose }: { onClose: () => void }) {
  const [activeNav, setActiveNav] = useState("chat");
  const [visibleMsgs, setVisibleMsgs] = useState(1);

  // Animate messages appearing one by one
  useEffect(() => {
    if (visibleMsgs >= DEMO_MESSAGES.length) return;
    const timer = setTimeout(() => setVisibleMsgs((v) => v + 1), 1200);
    return () => clearTimeout(timer);
  }, [visibleMsgs]);

  const navItems = [
    { id: "chat", label: "Chat", icon: <ChatIcon /> },
    { id: "terminal", label: "Claude Code", icon: <TerminalIcon />, badge: true },
    { id: "browser", label: "Browser", icon: <GlobeIcon /> },
    { id: "settings", label: "Settings", icon: <GearIcon /> },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(860px, 90vw)",
        height: "min(580px, 80vh)",
        zIndex: 9999,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        background: "#0c0d10",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 25px 80px rgba(0,0,0,0.7), 0 0 40px rgba(102,126,234,0.15)",
        animation: "panelExpand 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          minWidth: "220px",
          background: "#0f1014",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minHeight: "56px",
          }}
        >
          <img src="/orb.png" alt="" style={{ width: "28px", height: "28px", borderRadius: "50%" }} />
          <span style={{ color: "#fafafa", fontSize: "15px", fontWeight: 600, flex: 1 }}>Voice Mirror</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#71717a", cursor: "pointer" }}>─</span>
            <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#71717a", cursor: "pointer" }}>◉</span>
            <span
              onClick={onClose}
              style={{ width: "12px", height: "12px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#ff453a", cursor: "pointer" }}
            >×</span>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ padding: "12px 8px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: activeNav === item.id ? "#667eea" : "#71717a",
                background: activeNav === item.id ? "rgba(102,126,234,0.15)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "12px 8px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", background: "#14161c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MicIcon />
            </div>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", background: "#14161c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#71717a" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            </div>
          </div>
          {/* Status */}
          <div
            style={{
              padding: "8px 10px",
              background: "#0c0d10",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#71717a",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                animation: "statusGlow 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            Listening...
          </div>
          {/* Collapse */}
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#71717a",
              fontSize: "13px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={onClose}
          >
            « Collapse
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeNav === "chat" ? (
          <>
            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {DEMO_MESSAGES.slice(0, visibleMsgs).map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    gap: "12px",
                    animation: "demoMsgRise 0.3s ease-out",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      background: msg.role === "user"
                        ? "rgba(102,126,234,0.15)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: msg.role === "user" ? "1px solid rgba(102,126,234,0.3)" : "none",
                    }}
                  >
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "4px", textAlign: msg.role === "user" ? "right" : "left" }}>
                      {msg.sender}
                    </div>
                    <div
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                        color: msg.role === "user" ? "#fff" : "#e4e4e7",
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, rgba(102,126,234,0.4), rgba(118,75,162,0.35))"
                          : "linear-gradient(135deg, #111318, #0c0d10)",
                        border: msg.role === "user"
                          ? "1px solid rgba(102,126,234,0.3)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {visibleMsgs < DEMO_MESSAGES.length && (
                <div style={{ display: "flex", gap: "12px", animation: "demoMsgRise 0.3s ease-out" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      background: DEMO_MESSAGES[visibleMsgs].role === "user"
                        ? "rgba(102,126,234,0.15)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: DEMO_MESSAGES[visibleMsgs].role === "user" ? "1px solid rgba(102,126,234,0.3)" : "none",
                    }}
                  >
                    {DEMO_MESSAGES[visibleMsgs].role === "user" ? "👤" : "🤖"}
                  </div>
                  <div style={{ padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center" }}>
                    <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot" style={{ animationDelay: "200ms" }} />
                    <span className="typing-dot" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Voice status bar (not a text input — chat is voice-driven) */}
            <div
              style={{
                padding: "12px 20px 8px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "rgba(102,126,234,0.1)",
                  border: "1px solid rgba(102,126,234,0.2)",
                }}
              >
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4ade80", animation: "statusGlow 2s ease-in-out infinite" }} />
                <span style={{ color: "#a8a29e", fontSize: "13px" }}>Listening for "Hey Claude"...</span>
              </div>
            </div>
          </>
        ) : activeNav === "terminal" ? (
          /* Claude Code page — terminal-style */
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ color: "#e4e4e7", fontSize: "13px", fontWeight: 500 }}>Claude Code</span>
              <span style={{ color: "#71717a", fontSize: "12px" }}>Running</span>
            </div>
            <div
              style={{
                flex: 1,
                padding: "16px",
                fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#e4e4e7",
                background: "#0a0a12",
                overflowY: "auto",
              }}
            >
              <div style={{ color: "#71717a" }}>$ claude</div>
              <div style={{ color: "#667eea", marginTop: "8px" }}>Claude Code v1.0.0</div>
              <div style={{ color: "#71717a", marginTop: "4px" }}>Ready. Type a message or use voice input.</div>
              <div style={{ marginTop: "16px" }}>
                <span style={{ color: "#667eea" }}>You:</span> Fix the null check on line 42
              </div>
              <div style={{ marginTop: "8px" }}>
                <span style={{ color: "#4ade80" }}>Claude:</span> I'll add a null check before the function call.
              </div>
              <div style={{ marginTop: "8px", color: "#71717a" }}>
                <div>Editing app.js...</div>
                <div style={{ color: "#4ade80" }}>✓ Updated line 42: added null guard</div>
                <div style={{ color: "#4ade80" }}>✓ All 12 tests passing</div>
              </div>
              <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#667eea" }}>❯</span>
                <span style={{ width: "8px", height: "16px", background: "#667eea", animation: "statusGlow 1s ease-in-out infinite" }} />
              </div>
            </div>
          </div>
        ) : (
          /* Browser / Settings placeholder */
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a", fontSize: "14px" }}>
            {activeNav === "browser" ? "Browser automation — navigate, click, screenshot, and more." : "Settings — AI providers, voice, hotkeys, and more."}
          </div>
        )}

        {/* Demo badge */}
        <div style={{ padding: "4px 20px 10px", textAlign: "center" }}>
          <span style={{ fontSize: "11px", color: "#57534e", letterSpacing: "0.05em" }}>
            INTERACTIVE DEMO — <a href="/docs/introduction/" style={{ color: "#667eea", textDecoration: "none" }}>Download the real thing</a>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Floating Orb Component ────────────────────────────── */
export function FloatingOrb() {
  const [expanded, setExpanded] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const orbRef = useRef<HTMLDivElement>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Set initial position
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos({ x: window.innerWidth - 152, y: window.innerHeight - 152 });
    setInitialized(true);

    // Show tooltip after 3 seconds
    tooltipTimerRef.current = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(tooltipTimerRef.current);
  }, []);

  // Drag handling
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setPos({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        setExpanded(true);
        setShowTooltip(false);
      }
      draggingRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    const rect = orbRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    e.preventDefault();
  }, []);

  if (!initialized) return null;

  return (
    <>
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 9998,
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}

      {expanded && <DemoPanel onClose={() => setExpanded(false)} />}

      {!expanded && (
        <div
          ref={orbRef}
          onPointerDown={handlePointerDown}
          style={{
            position: "fixed",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {/* Tooltip */}
          {showTooltip && (
            <div
              style={{
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
                borderRadius: "10px",
                padding: "6px 14px",
                fontSize: "13px",
                color: "#e4e4e7",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                animation: "fadeIn 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Click for demo
            </div>
          )}

          {/* The orb */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "grab",
              transition: "box-shadow 0.3s ease",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              animation: "orbFloat 3s ease-in-out infinite",
            }}
            title="Click to expand demo"
          >
            <img
              src="/orb.png"
              alt="Voice Mirror orb"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
