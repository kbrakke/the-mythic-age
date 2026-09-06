import { ruleName, ruleText, type RuleRef } from "../data/game-rules";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./rule-pill.css";

export default function RulePill({ rule }: { rule: RuleRef }) {
  const id = useId();
  const anchor = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLSpanElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [position, setPosition] = useState<{ left: number; top: number }>();
  const cancelLeave = () => clearTimeout(leaveTimer.current);
  const close = () => { cancelLeave(); setPosition(undefined); };
  const leave = () => { leaveTimer.current = setTimeout(close, 150); };
  const show = () => {
    cancelLeave();
    const rect = anchor.current?.getBoundingClientRect();
    if (rect) setPosition({ left: Math.max(8, Math.min(rect.left, window.innerWidth - 336)), top: rect.bottom + 8 });
  };
  useEffect(() => {
    if (!position) return;
    const bounds = popup.current?.getBoundingClientRect();
    if (bounds && bounds.bottom > window.innerHeight - 8) {
      setPosition({ ...position, top: Math.max(8, (anchor.current?.getBoundingClientRect().top ?? 0) - bounds.height - 8) });
    }
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    const outside = (event: PointerEvent) => {
      if (!anchor.current?.contains(event.target as Node) && !popup.current?.contains(event.target as Node)) close();
    };
    const scroll = (event: Event) => {
      if (popup.current?.contains(event.target as Node)) return;
      // Keyboard focus can scroll a table horizontally; keep its rules visible.
      if (document.activeElement === anchor.current) show();
      else close();
    };
    window.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", close);
    };
  }, [position]);
  useEffect(() => () => clearTimeout(leaveTimer.current), []);
  return (
    <>
    <button ref={anchor} type="button" className="wb-rule-pill" data-rule-id={rule.ruleId}
      aria-describedby={position ? id : undefined} onMouseEnter={show} onMouseLeave={leave}
      onFocus={show} onBlur={close} onClick={(event) => { event.stopPropagation(); show(); }}>
      {ruleName(rule)}
    </button>
    {position && createPortal(<span ref={popup} id={id} className="rule-tooltip not-content" role="tooltip" style={position} onMouseEnter={cancelLeave} onMouseLeave={leave}>
        <strong>{ruleName(rule)}</strong>
        <span>{ruleText(rule)}</span>
      </span>, document.body)}
    </>
  );
}
