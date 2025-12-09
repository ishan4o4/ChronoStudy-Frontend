import React, { useEffect, useState } from "react";
import { api } from "../utils/api";

const steps = [
  {
    id: "sidebar",
    selector: "aside", 
    title: "Sidebar Navigation",
    text: "Use this panel to move between Dashboard, Tasks, Calendar and Stats."
  },
  {
    id: "topbar",
    selector: ".app-topbar", 
    title: "Top Bar",
    text: "The top bar is fixed in place and always visible."
  },
  {
    id: "profile-settings",
    selector: ".profile-icon-wrapper", 
    title: "Profile and Settings",
    text: "Click this icon to change settings (including password), log out, and adjust notification durations."
  },
  {
    id: "dashboard-cards",
    selector: ".dashboard-top-cards", 
    title: "Your Stats",
    text: "These cards show your total time, today’s focus, and task progress."
  },
  {
    id: "today-queue",
    selector: ".today-queue-box", 
    title: "Today's Queue",
    text: "These are tasks for today. Track, start timers, and complete tasks."
  },
  {
    id: "calendar-box",
    selector: ".calendar-box", 
    title: "Calendar",
    text: "Plan study blocks for upcoming days here."
  }
];

const OnboardingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({}); // New state for dynamic tooltip style

  const step = steps[stepIndex];

  // Get onboarding status from server
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/onboarding/status");
        if (!res.data.seen) setVisible(true);
      } catch (err) {
        console.error("Failed loading onboarding", err);
      }
    };
    load();
  }, []);

  // Function to determine tooltip placement dynamically
  const getTooltipPosition = (rect) => {
    const tooltipHeight = 200; // Estimated height for visibility check
    const padding = 16;
    let top, left;

    // Default placement: BELOW the highlighted element
    top = rect.bottom + padding;
    left = rect.left;

    // Check if placing it BELOW pushes it off the bottom of the viewport
    if (top + tooltipHeight > window.innerHeight) {
      // Alternative placement: ABOVE the highlighted element
      top = rect.top - padding - tooltipHeight;
      
      // If placing it ABOVE still goes off the top (unlikely for most dashboard elements),
      // force it to the top of the viewport
      if (top < padding) {
        top = padding;
      }
    }
    
    // Ensure it doesn't overflow the right side of the screen
    const tooltipWidth = 320; 
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    
    // Ensure it doesn't go off the left side
    left = Math.max(padding, left);


    return { top, left };
  };

  // Function to calculate position, including re-calculation on scroll/resize
  const calculatePosition = () => {
    if (!visible || !step) return;

    const el = document.querySelector(step.selector);
    if (!el) {
      setHighlightRect(null);
      setTooltipStyle({});
      return;
    }

    const rect = el.getBoundingClientRect();

    // 1. Calculate Highlight position (using viewport coords)
    const padding = 10;
    const highlight = {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + 2 * padding,
      height: rect.height + 2 * padding
    };
    setHighlightRect(highlight);
    
    // 2. Calculate Tooltip position for visibility
    setTooltipStyle(getTooltipPosition(rect));
    
    // Auto-scroll the page to bring the element into view if needed
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Set up listeners for initial position, resize, and scroll
  useEffect(() => {
    if (!visible) return;

    // Initial calculation after a slight delay for layout stability
    // We use a small loop to ensure the element has fully rendered and has dimensions
    let timerId;
    const maxAttempts = 10;
    let attempts = 0;

    const tryCalculate = () => {
        const el = document.querySelector(step.selector);
        if (el && el.offsetHeight > 0) {
            calculatePosition();
        } else if (attempts < maxAttempts) {
            attempts++;
            timerId = setTimeout(tryCalculate, 100);
        } else {
            console.error(`Tutorial failed to find element ${step.selector} after ${maxAttempts} attempts.`);
        }
    };
    tryCalculate();
    
    window.addEventListener("resize", calculatePosition);
    
    const mainContent = document.querySelector(".flex-1.overflow-y-auto");
    if (mainContent) {
      mainContent.addEventListener("scroll", calculatePosition, { passive: true });
    }
    
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", calculatePosition);
      if (mainContent) {
        mainContent.removeEventListener("scroll", calculatePosition);
      }
    };
  }, [stepIndex, visible, step?.selector]); 


  if (!visible || !highlightRect) return null;

  const finish = async () => {
    setVisible(false);
    try {
      await api.post("/auth/onboarding/done");
    } catch (err) {
      console.error("Failed to save onboarding:", err);
    }
  };

  const next = () => {
    if (stepIndex === steps.length - 1) return finish();
    setStepIndex(stepIndex + 1);
  };

  const prev = () => setStepIndex(Math.max(0, stepIndex - 1));

  return (
    <>
      {/* Dark overlay: Lighter opacity (bg-black/40), allows interaction */}
      <div 
          className="fixed inset-0 bg-black/40 z-[9998]"
          style={{ pointerEvents: 'none' }} // FIX: Allows scroll/clicks to pass
      />

      {/* Highlight "spotlight" */}
      <div
        className="fixed z-[9999] rounded-xl border-2 border-neon-blue shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all duration-300"
        style={{
          top: highlightRect.top,
          left: highlightRect.left,
          width: highlightRect.width,
          height: highlightRect.height,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      />

      {/* Floating tooltip box - Uses calculated style for visibility */}
      <div
        className="fixed z-[10000] neo-card p-4 rounded-xl shadow-xl bg-slate-900/95 border border-slate-700 w-80 max-w-[90vw]"
        style={tooltipStyle} // <<<< Uses dynamically calculated top/left
      >
        <h3 className="text-sm font-semibold text-slate-100 mb-1">
          {step.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3">{step.text}</p>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={finish}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            Skip
          </button>

          <div className="flex gap-2">
            {stepIndex > 0 && (
              <button
                onClick={prev}
                className="neo-button px-3 py-1 text-xs bg-slate-700"
              >
                Back
              </button>
            )}
            <button onClick={next} className="neo-button px-3 py-1 text-xs">
              {stepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingOverlay;