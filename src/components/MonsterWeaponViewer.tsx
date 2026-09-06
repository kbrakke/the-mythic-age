import { Children, useState, type ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import "./monster-weapon-viewer.css";

export function BaseFeatures({ children }: { children: ReactNode }) {
  return (
    <section className="mwv-base">
      <div className="mwv-label"><Sparkles size={15} /> Innate properties</div>
      <div>{children}</div>
    </section>
  );
}

export function TreeSelector({ trees, children }: { trees: string[]; children: ReactNode }) {
  const branches = Children.toArray(children);
  const [active, setActive] = useState(0);

  return (
    <section className="mwv-trees">
      <div className="mwv-tabs" role="tablist" aria-label="Monster weapon paths">
        {trees.map((tree, index) => (
          <button
            aria-selected={active === index}
            className={active === index ? "is-active" : ""}
            key={tree}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span>Path {index + 1}</span>{tree}
          </button>
        ))}
      </div>
      <div className="mwv-branch" role="tabpanel">{branches[active]}</div>
    </section>
  );
}

export function TreeBranch({ description, children }: { description?: string; children: ReactNode }) {
  return (
    <div>
      {description && <p className="mwv-description">{description}</p>}
      <div className="mwv-tier-list">{children}</div>
    </div>
  );
}

export function InfusionTier({
  tier,
  name,
  bonus,
  children,
}: {
  tier: "minor" | "major" | "apex";
  name: string;
  bonus?: string;
  children: ReactNode;
}) {
  const rank = tier === "minor" ? 1 : tier === "major" ? 2 : 3;
  return (
    <details className={`mwv-tier mwv-tier-${tier}`} open={tier === "minor"}>
      <summary>
        <span className="mwv-rank">{rank}</span>
        <span><small>{tier} infusion</small><strong>{name}</strong></span>
        {bonus && <b>{bonus}</b>}
        <ChevronDown size={18} />
      </summary>
      <div className="mwv-tier-content">{children}</div>
    </details>
  );
}

export function WeaponVariant({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="mwv-variant">
      <strong>{label}</strong>
      <div>{children}</div>
    </aside>
  );
}
