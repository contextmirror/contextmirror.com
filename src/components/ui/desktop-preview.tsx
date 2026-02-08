import { useState } from "react";

type OS = "windows" | "macos" | "linux";

const OS_OPTIONS: { id: OS; label: string; icon: string }[] = [
  { id: "windows", label: "Windows", icon: "⊞" },
  { id: "macos", label: "macOS", icon: "⌘" },
  { id: "linux", label: "Linux", icon: "🐧" },
];

/* ── Fake code editor content (shared across all OS mockups) ── */
function CodeEditor() {
  return (
    <div style={{ padding: "10px", fontFamily: "'JetBrains Mono', 'SF Mono', monospace", fontSize: "10px", lineHeight: "1.7", color: "rgba(255,255,255,0.4)" }}>
      <div><span style={{ color: "rgba(180,130,255,0.6)" }}>const</span> <span style={{ color: "rgba(130,180,255,0.6)" }}>config</span> = <span style={{ color: "rgba(255,220,130,0.6)" }}>require</span>(<span style={{ color: "rgba(130,255,160,0.6)" }}>'./config'</span>);</div>
      <div><span style={{ color: "rgba(180,130,255,0.6)" }}>const</span> <span style={{ color: "rgba(130,180,255,0.6)" }}>app</span> = <span style={{ color: "rgba(255,220,130,0.6)" }}>express</span>();</div>
      <div style={{ marginTop: "6px", color: "rgba(255,255,255,0.2)" }}>// ...</div>
      <div style={{ marginTop: "6px" }}><span style={{ color: "rgba(180,130,255,0.6)" }}>function</span> <span style={{ color: "rgba(255,220,130,0.6)" }}>handleRequest</span>(<span style={{ color: "rgba(130,180,255,0.6)" }}>req</span>) {"{"}</div>
      <div>&nbsp;&nbsp;<span style={{ color: "rgba(180,130,255,0.6)" }}>const</span> data = req.body;</div>
      <div>&nbsp;&nbsp;<span style={{ color: "rgba(180,130,255,0.6)" }}>return</span> process(data);</div>
      <div>{"}"}</div>
    </div>
  );
}

/* ── Windows Desktop (Windows 11 style) ──────────────────────── */
function WindowsDesktop() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1a1a3e 0%, #1e3a5f 40%, #0d2847 100%)" }}>
      {/* Wallpaper bloom effect */}
      <div style={{ position: "absolute", top: "30%", left: "40%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* VS Code window (Win11 rounded corners, title bar style) */}
      <div style={{ position: "absolute", top: "12px", left: "16px", right: "45%", bottom: "50px", borderRadius: "8px", background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
        {/* Win11 title bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "4px 8px", background: "#181825", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", flex: 1, paddingLeft: "4px" }}>app.js — Visual Studio Code</span>
          <div style={{ display: "flex", gap: "0px" }}>
            <div style={{ width: "28px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "10px", cursor: "pointer" }}>─</div>
            <div style={{ width: "28px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "8px", cursor: "pointer" }}>☐</div>
            <div style={{ width: "28px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "10px", cursor: "pointer" }}>✕</div>
          </div>
        </div>
        <CodeEditor />
      </div>

      {/* Win11 centered taskbar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42px", background: "rgba(32,32,40,0.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Centered icons */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "2px" }}>
          {/* Start button (Win11 blue) */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="#0078d4"/><rect x="9" y="1" width="6" height="6" rx="1" fill="#0078d4"/><rect x="1" y="9" width="6" height="6" rx="1" fill="#0078d4"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#0078d4"/></svg>
          </div>
          {/* Search */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          {/* File Explorer */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          </div>
          {/* Edge browser */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10"/></svg>
          </div>
          {/* VS Code (active - has underline) */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0078d4" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            <div style={{ position: "absolute", bottom: "2px", left: "8px", right: "8px", height: "2px", borderRadius: "1px", background: "#0078d4" }} />
          </div>
          {/* Terminal */}
          <div style={{ width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 9l3 3-3 3"/></svg>
          </div>
        </div>
        {/* System tray (right) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingRight: "12px", fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>
          <span>^</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
          <div style={{ fontSize: "9px" }}>
            <div>12:00</div>
            <div style={{ fontSize: "8px" }}>06/02</div>
          </div>
        </div>
      </div>

      {/* Voice Mirror orb */}
      <div style={{ position: "absolute", bottom: "54px", right: "32px" }}>
        <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "3px 10px", fontSize: "9px", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "6px", textAlign: "center" }}>
          Voice Mirror
        </div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", boxShadow: "0 0 28px rgba(102,126,234,0.4)", animation: "orbFloat 3s ease-in-out infinite" }}>
          <img src="/orb.png" alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}

/* ── macOS Desktop (Sonoma style) ────────────────────────────── */
function MacOSDesktop() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1a0533 0%, #0d3b66 40%, #0b525b 100%)" }}>
      {/* Wallpaper bloom */}
      <div style={{ position: "absolute", top: "20%", left: "30%", width: "60%", height: "60%", background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* macOS menu bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "25px", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(24px)", display: "flex", alignItems: "center", padding: "0 14px", fontSize: "11px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <svg width="12" height="14" viewBox="0 0 170 200" fill="rgba(255,255,255,0.85)"><path d="M150.4 172.2c-3.8 8.5-8.2 16.3-13.4 23.4-7.1 9.6-12.8 16.2-17.3 19.8-6.9 5.9-14.3 8.9-22.2 9.1-5.7 0-12.5-1.6-20.6-4.9-8-3.3-15.4-4.9-22.1-4.9-7.1 0-14.6 1.6-22.8 4.9-8.1 3.3-14.7 5-19.7 5.2-7.6.3-15.2-2.8-22.8-9.4-4.8-3.9-10.8-10.7-18-20.3-7.7-10.3-14.1-22.3-19.1-36C4.8 145.5 2 132.4 2 119.7c0-14.6 3.2-27.2 9.5-37.8 5-8.4 11.6-15 19.8-19.9 8.3-4.9 17.2-7.4 26.8-7.6 6 0 13.9 1.9 23.8 5.5 9.8 3.7 16.1 5.5 18.9 5.5 2.1 0 9.1-2.2 21-6.5 11.3-4 20.8-5.7 28.6-5 21.2 1.7 37.1 10 47.6 25-18.9 11.5-28.3 27.5-28.1 48.1.2 16 6 29.4 17.3 40 5.1 4.9 10.9 8.6 17.2 11.3-1.4 4-2.8 7.9-4.4 11.4zM116.1 8c0 12.6-4.6 24.3-13.7 35.2-11 13-24.3 20.5-38.7 19.3-.2-1.5-.3-3.1-.3-4.8 0-12.1 5.2-25 14.5-35.6 4.6-5.4 10.5-9.8 17.6-13.4 7.1-3.5 13.8-5.4 20.1-5.8.2 1.7.3 3.4.3 5.1z"/></svg>
          <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Code</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>File</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Edit</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Selection</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>View</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/></svg>
          <span>100%</span>
          <span>Thu 12:00</span>
        </div>
      </div>

      {/* VS Code window (macOS style) */}
      <div style={{ position: "absolute", top: "36px", left: "16px", right: "45%", bottom: "68px", borderRadius: "10px", background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "8px 12px", background: "#181825", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
          </div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", flex: 1, textAlign: "center" }}>app.js — Visual Studio Code</span>
        </div>
        <CodeEditor />
      </div>

      {/* macOS Dock */}
      <div style={{ position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)", height: "50px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(24px)", borderRadius: "14px", display: "flex", alignItems: "center", padding: "0 6px", gap: "3px", border: "1px solid rgba(255,255,255,0.12)" }}>
        {/* Dock icons — stylized app colors */}
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #34d399, #059669)", boxShadow: "0 2px 6px rgba(5,150,105,0.3)" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #60a5fa, #2563eb)", boxShadow: "0 2px 6px rgba(37,99,235,0.3)" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #f97316, #ea580c)", boxShadow: "0 2px 6px rgba(234,88,12,0.3)" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 2px 6px rgba(124,58,237,0.3)" }} />
        <div style={{ width: "1px", height: "34px", background: "rgba(255,255,255,0.1)", margin: "0 2px" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #818cf8, #4f46e5)", boxShadow: "0 2px 6px rgba(79,70,229,0.3)" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #fb7185, #e11d48)", boxShadow: "0 2px 6px rgba(225,29,72,0.3)" }} />
        <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #38bdf8, #0284c7)", boxShadow: "0 2px 6px rgba(2,132,199,0.3)" }} />
      </div>

      {/* Voice Mirror orb */}
      <div style={{ position: "absolute", bottom: "68px", right: "32px" }}>
        <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "3px 10px", fontSize: "9px", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.12)", marginBottom: "6px", textAlign: "center" }}>
          Voice Mirror
        </div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", boxShadow: "0 0 28px rgba(102,126,234,0.4)", animation: "orbFloat 3s ease-in-out infinite" }}>
          <img src="/orb.png" alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Linux Desktop (GNOME-style) ─────────────────────────────── */
function LinuxDesktop() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #233554 50%, #2d4059 100%)" }}>
      {/* GNOME top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28px", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
        <span>Thu Feb 6 &nbsp; 12:00</span>
        <div style={{ position: "absolute", right: "12px", display: "flex", gap: "8px", alignItems: "center", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
          <span>🔊</span>
          <span>🔋</span>
          <span>⚙</span>
        </div>
        <div style={{ position: "absolute", left: "12px", fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
          Activities
        </div>
      </div>

      {/* Terminal window */}
      <div style={{ position: "absolute", top: "40px", left: "20px", right: "45%", bottom: "20px", borderRadius: "10px", background: "#0a0a12", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", background: "#1a1a24", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: "8px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(239,68,68,0.6)" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(234,179,8,0.6)" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(34,197,94,0.6)" }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginLeft: "8px" }}>user@dev: ~/project</span>
        </div>
        <div style={{ padding: "10px", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)" }}>
          <div><span style={{ color: "rgba(130,255,160,0.7)" }}>user@dev</span>:<span style={{ color: "rgba(130,180,255,0.7)" }}>~/project</span>$ npm start</div>
          <div style={{ color: "rgba(255,255,255,0.3)" }}>Server running on port 3000</div>
          <div style={{ marginTop: "6px" }}><span style={{ color: "rgba(130,255,160,0.7)" }}>user@dev</span>:<span style={{ color: "rgba(130,180,255,0.7)" }}>~/project</span>$ voice-mirror</div>
          <div style={{ color: "rgba(102,126,234,0.8)" }}>Voice Mirror v1.0.0 — Listening...</div>
          <div style={{ marginTop: "4px", color: "rgba(255,255,255,0.3)" }}>Wake word: "Hey Claude"</div>
          <div style={{ marginTop: "4px", display: "flex", gap: "4px", alignItems: "center" }}>
            <span style={{ color: "rgba(74,222,128,0.8)" }}>●</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Connected to Ollama (llama3.1:8b)</span>
          </div>
        </div>
      </div>

      {/* Voice Mirror orb */}
      <div style={{ position: "absolute", bottom: "32px", right: "36px" }}>
        <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "3px 10px", fontSize: "9px", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "6px", textAlign: "center" }}>
          Voice Mirror
        </div>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", boxShadow: "0 0 28px rgba(102,126,234,0.4)", animation: "orbFloat 3s ease-in-out infinite" }}>
          <img src="/orb.png" alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Install commands per OS ──────────────────────────────────── */
const INSTALL_COMMANDS: Record<OS, { oneliner: string; label: string; shell: string }> = {
  windows: {
    oneliner: "irm https://raw.githubusercontent.com/contextmirror/voice-mirror-electron/main/install.ps1 | iex",
    label: "PowerShell",
    shell: "PS >",
  },
  macos: {
    oneliner: "curl -fsSL https://raw.githubusercontent.com/contextmirror/voice-mirror-electron/main/install.sh | bash",
    label: "Terminal",
    shell: "$",
  },
  linux: {
    oneliner: "curl -fsSL https://raw.githubusercontent.com/contextmirror/voice-mirror-electron/main/install.sh | bash",
    label: "Terminal",
    shell: "$",
  },
};

/* ── Copy button ─────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px",
        color: copied ? "#22c55e" : "rgba(255,255,255,0.4)",
        transition: "color 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export function DesktopPreview() {
  const [activeOS, setActiveOS] = useState<OS>("windows");

  const install = INSTALL_COMMANDS[activeOS];

  return (
    <div>
      {/* OS selector tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
        {OS_OPTIONS.map((os) => (
          <button
            key={os.id}
            onClick={() => setActiveOS(os.id)}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: activeOS === os.id ? "1px solid rgba(234,88,12,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: activeOS === os.id ? "rgba(234,88,12,0.15)" : "rgba(255,255,255,0.02)",
              color: activeOS === os.id ? "#fb923c" : "#a8a29e",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{os.icon}</span>
            {os.label}
          </button>
        ))}
      </div>

      {/* Desktop mockup */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(28,25,23,0.6)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          aspectRatio: "16 / 9",
          position: "relative",
        }}
      >
        {activeOS === "windows" && <WindowsDesktop />}
        {activeOS === "macos" && <MacOSDesktop />}
        {activeOS === "linux" && <LinuxDesktop />}
      </div>

      {/* Install command */}
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(10,10,18,0.8)",
            overflow: "hidden",
          }}
        >
          {/* Shell header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
              {install.label}
            </span>
            <CopyButton text={install.oneliner} />
          </div>
          {/* Command */}
          <div style={{ padding: "14px 16px", fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}>
            <code style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", wordBreak: "break-all" }}>
              <span style={{ color: "rgba(130,255,160,0.7)", userSelect: "none" }}>{install.shell} </span>
              {install.oneliner}
            </code>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "13px", color: "#78716c" }}>
          One command to install. Available on Windows, macOS, and Linux.
        </p>
      </div>
    </div>
  );
}
