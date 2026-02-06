import { SplineScene } from "@/components/ui/splite";
import { useEffect, useRef } from "react";

export function SplineHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Forward pointer events from anywhere on the page to the Spline canvas.
    // The canvas has pointer-events: none via CSS, so only these dispatched
    // events reach it — no native wheel/scroll events can affect the scene.
    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const canvas = container.querySelector("canvas");
      if (!canvas) return;

      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: false,
          cancelable: true,
          pointerId: e.pointerId,
          pointerType: e.pointerType,
        })
      );
      canvas.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: false,
          cancelable: true,
        })
      );
    };

    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: "50%",
          right: "-5%",
          transform: "translateY(-50%)",
          width: "38%",
          height: "75%",
          pointerEvents: "none",
          opacity: 0.4,
        }}
      >
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
