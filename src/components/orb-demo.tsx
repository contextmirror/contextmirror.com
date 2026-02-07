/**
 * orb-demo.tsx — Accurate orb state demo for the Voice Mirror page.
 * Direct port of the real orb-canvas.js renderer, showing three states:
 * Idle, Human Speaks (recording), AI Speaks (speaking).
 */
import { useEffect, useRef, useState } from 'react';

// --- Math helpers ---
const TAU = Math.PI * 2;

function lerp(a: number, b: number, t: number): number {
  return Math.round(a * (1 - t) + b * t);
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function roundedRectSDF(px: number, py: number, halfW: number, halfH: number, cornerR: number): number {
  const qx = Math.abs(px) - halfW + cornerR;
  const qy = Math.abs(py) - halfH + cornerR;
  const outside = Math.sqrt(Math.max(0, qx) ** 2 + Math.max(0, qy) ** 2);
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - cornerR;
}

// --- State types ---
type OrbState = 'idle' | 'recording' | 'speaking';

const DURATIONS: Record<OrbState, number> = {
  idle: 1500,
  recording: 500,
  speaking: 1000,
};

// --- Color transform ---
function applyStateColor(r: number, g: number, b: number, alpha: number, state: OrbState): [number, number, number, number] {
  let rf = r / 255;
  let gf = g / 255;
  let bf = b / 255;

  switch (state) {
    case 'idle':
      break;
    case 'recording':
      rf = Math.min(rf * 1.3 + 0.1, 1);
      gf *= 0.7;
      break;
    case 'speaking':
      bf = Math.min(bf * 1.2 + 0.1, 1);
      gf = Math.min(gf * 1.1 + 0.05, 1);
      rf *= 0.8;
      break;
  }
  return [rf, gf, bf, alpha];
}

// --- Blend ---
function blendOver(data: Uint8ClampedArray, offset: number, sr: number, sg: number, sb: number, sa: number): void {
  const dr = data[offset];
  const dg = data[offset + 1];
  const db = data[offset + 2];
  const da = data[offset + 3];
  data[offset]     = Math.min(255, sr * sa * 255 + dr * (1 - sa)) | 0;
  data[offset + 1] = Math.min(255, sg * sa * 255 + dg * (1 - sa)) | 0;
  data[offset + 2] = Math.min(255, sb * sa * 255 + db * (1 - sa)) | 0;
  data[offset + 3] = Math.min(255, sa * 255 + da * (1 - sa)) | 0;
}

// --- Icon renderers ---
function drawHumanIcon(imageData: ImageData, width: number, height: number, cx: number, cy: number, innerRadius: number, state: OrbState): void {
  const data = imageData.data;
  const iconScale = innerRadius * 0.55;
  const headCy = cy - iconScale * 0.3;
  const headR = iconScale * 0.32;
  const bodyCy = cy + iconScale * 0.35;
  const bodyRx = iconScale * 0.55;
  const bodyRy = iconScale * 0.45;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const odx = px - cx, ody = py - cy;
      if (Math.sqrt(odx * odx + ody * ody) > innerRadius) continue;

      let iconAlpha = 0;

      const hdx = px - cx, hdy = py - headCy;
      const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
      if (hdist < headR + 0.5) {
        iconAlpha = hdist > headR - 0.5 ? 1 - (hdist - (headR - 0.5)) : 1;
      }

      if (py > headCy + headR * 0.5) {
        const sdx = (px - cx) / bodyRx;
        const sdy = (py - bodyCy) / bodyRy;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        if (sdist < 1 + 0.5 / bodyRx && py < bodyCy + bodyRy * 0.15) {
          const sa = sdist > 1 - 0.5 / bodyRx
            ? 1 - (sdist - (1 - 0.5 / bodyRx)) * bodyRx
            : 1;
          iconAlpha = Math.max(iconAlpha, clamp(sa, 0, 1));
        }
      }

      if (iconAlpha > 0) {
        const offset = (y * width + x) * 4;
        const [ir, ig, ib] = applyStateColor(220, 220, 240, 1, state);
        const a = iconAlpha * 0.85;
        blendOver(data, offset, ir, ig, ib, a);
      }
    }
  }
}

function drawRobotIcon(imageData: ImageData, width: number, height: number, cx: number, cy: number, innerRadius: number, state: OrbState): void {
  const data = imageData.data;
  const iconScale = innerRadius * 0.5;
  const headW = iconScale * 0.7;
  const headH = iconScale * 0.55;
  const headCy = cy + iconScale * 0.05;
  const headCornerR = iconScale * 0.1;

  const antennaX = cx;
  const antennaTop = headCy - headH - iconScale * 0.25;
  const antennaBottom = headCy - headH;
  const antennaW = iconScale * 0.06;
  const antennaBallR = iconScale * 0.1;

  const eyeY = headCy - headH * 0.15;
  const eyeSpacing = headW * 0.4;
  const eyeR = iconScale * 0.12;

  const bodyTop = headCy + headH + iconScale * 0.05;
  const bodyW = headW * 0.85;
  const bodyH = iconScale * 0.35;
  const bodyCornerR = iconScale * 0.06;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const odx = px - cx, ody = py - cy;
      if (Math.sqrt(odx * odx + ody * ody) > innerRadius) continue;

      let iconAlpha = 0;

      if (Math.abs(px - antennaX) < antennaW && py >= antennaTop && py <= antennaBottom) {
        iconAlpha = 1;
      }

      const adx = px - antennaX, ady = py - antennaTop;
      const adist = Math.sqrt(adx * adx + ady * ady);
      if (adist < antennaBallR + 0.5) {
        const aa = adist > antennaBallR - 0.5 ? 1 - (adist - (antennaBallR - 0.5)) : 1;
        iconAlpha = Math.max(iconAlpha, clamp(aa, 0, 1));
      }

      const inHead = roundedRectSDF(px - cx, py - headCy, headW, headH, headCornerR);
      if (inHead < 0.5) {
        const ha = inHead > -0.5 ? 0.5 - inHead : 1;
        iconAlpha = Math.max(iconAlpha, clamp(ha, 0, 1));
      }

      let isEye = false;
      for (const ex of [cx - eyeSpacing, cx + eyeSpacing]) {
        const edx = px - ex, edy = py - eyeY;
        if (Math.sqrt(edx * edx + edy * edy) < eyeR + 0.5) {
          isEye = true;
        }
      }

      const inBody = roundedRectSDF(px - cx, py - (bodyTop + bodyH), bodyW, bodyH, bodyCornerR);
      if (inBody < 0.5) {
        const ba = inBody > -0.5 ? 0.5 - inBody : 1;
        iconAlpha = Math.max(iconAlpha, clamp(ba, 0, 1));
      }

      if (iconAlpha > 0) {
        const offset = (y * width + x) * 4;
        if (isEye) {
          const [ir, ig, ib] = applyStateColor(20, 15, 40, 1, state);
          blendOver(data, offset, ir, ig, ib, 0.9);
        } else {
          const [ir, ig, ib] = applyStateColor(220, 220, 240, 1, state);
          blendOver(data, offset, ir, ig, ib, iconAlpha * 0.85);
        }
      }
    }
  }
}

// --- Main orb render ---
function renderOrb(imageData: ImageData, width: number, height: number, state: OrbState, phase: number): void {
  const data = imageData.data;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 1;

  let scale: number;
  switch (state) {
    case 'idle':
      scale = 1 + 0.05 * Math.sin(phase * TAU);
      break;
    case 'recording':
      scale = 1 + 0.12 * Math.sin(phase * TAU);
      break;
    case 'speaking':
      scale = phase < 0.5
        ? 1 + 0.08 * Math.sin(phase * 2 * TAU)
        : 1 - 0.05 * Math.sin((phase - 0.5) * 2 * TAU);
      break;
    default:
      scale = 1;
  }

  const radius = maxRadius * clamp(scale, 0.5, 1);
  const innerRadius = radius - 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const offset = (y * width + x) * 4;

      if (dist > radius + 0.5) {
        data[offset] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
        data[offset + 3] = 0;
        continue;
      }

      const edgeAlpha = dist > radius - 0.5
        ? 1 - (dist - (radius - 0.5))
        : 1;

      let rf: number, gf: number, bf: number, af: number;

      if (dist > innerRadius) {
        const borderAlpha = edgeAlpha * 0.5;
        [rf, gf, bf, af] = applyStateColor(102, 126, 234, borderAlpha, state);
      } else {
        const t = dist / innerRadius;
        const rv = lerp(0x2d, 0x0d, t);
        const gv = lerp(0x1b, 0x0d, t);
        const bv = lerp(0x4e, 0x1a, t);
        [rf, gf, bf, af] = applyStateColor(rv, gv, bv, edgeAlpha * 0.95, state);
      }

      data[offset]     = (rf * af * 255) | 0;
      data[offset + 1] = (gf * af * 255) | 0;
      data[offset + 2] = (bf * af * 255) | 0;
      data[offset + 3] = (af * 255) | 0;
    }
  }

  if (state === 'recording') {
    drawHumanIcon(imageData, width, height, cx, cy, innerRadius, state);
  } else if (state === 'speaking') {
    drawRobotIcon(imageData, width, height, cx, cy, innerRadius, state);
  }
}

// --- Single animated orb canvas ---
function OrbCanvas({ state, size = 96 }: { state: OrbState; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseStartRef = useRef(performance.now());

  useEffect(() => {
    phaseStartRef.current = performance.now();
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    function tick() {
      const now = performance.now();
      const duration = DURATIONS[state];
      const phase = ((now - phaseStartRef.current) % duration) / duration;

      const w = canvas!.width;
      const h = canvas!.height;
      const imageData = ctx!.createImageData(w, h);
      renderOrb(imageData, w, h, state, phase);
      ctx!.putImageData(imageData, 0, 0);

      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        imageRendering: 'auto',
      }}
    />
  );
}

// --- Glow color per state ---
const GLOW_COLORS: Record<OrbState, string> = {
  idle: 'rgba(102, 126, 234, 0.3)',
  recording: 'rgba(234, 102, 102, 0.3)',
  speaking: 'rgba(102, 180, 234, 0.3)',
};

const STATE_INFO: { state: OrbState; label: string; description: string }[] = [
  { state: 'idle', label: 'Idle', description: 'Purple gradient with gentle pulse — listening for wake word or input' },
  { state: 'recording', label: 'Human Speaks', description: 'Pink/red shift with human silhouette — capturing your voice' },
  { state: 'speaking', label: 'AI Speaks', description: 'Blue/cyan shift with robot icon — AI responding via voice' },
];

export function OrbStateDemo() {
  const [activeState, setActiveState] = useState<OrbState>('idle');

  return (
    <div>
      {/* Large featured orb */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-[40px] transition-colors duration-700"
            style={{ background: GLOW_COLORS[activeState], transform: 'scale(2.5)' }}
          />
          <div className="relative">
            <OrbCanvas state={activeState} size={128} />
          </div>
        </div>
      </div>

      {/* State selector cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {STATE_INFO.map(({ state, label, description }) => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`group rounded-2xl border p-6 text-center transition-all duration-300 cursor-pointer ${
              activeState === state
                ? 'border-white/20 bg-white/[0.04]'
                : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-[12px] transition-colors duration-500"
                  style={{ background: GLOW_COLORS[state], transform: 'scale(2)' }}
                />
                <div className="relative">
                  <OrbCanvas state={state} size={64} />
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-white text-lg">{label}</h3>
            <p className="mt-2 text-sm text-surface-400 leading-relaxed">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
