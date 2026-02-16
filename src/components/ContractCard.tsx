import React from "react";

export interface ContractCardProps {
	name: string;
	tags: string;
	payout?: string;
	children: React.ReactNode;
}

export default function ContractCard({
	name,
	tags,
	payout = "—",
	children,
}: ContractCardProps) {
	return (
		<details className="contract-card group rounded-lg border border-[var(--sl-color-accent-low)] overflow-hidden shadow-sm">
			<summary className="cursor-pointer list-none px-4 py-3 font-semibold transition-all hover:bg-[var(--sl-color-accent)]/15 bg-[var(--sl-color-accent)]/5 [&::-webkit-details-marker]:hidden">
				<span className="flex flex-wrap items-center justify-between gap-2">
					<span className="flex items-center gap-2">
						<svg className="size-4 shrink-0 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
							<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
						</svg>
						{name}
					</span>
					<span className="text-base opacity-90" aria-hidden>
						{tags}
					</span>
				</span>
				<span className="mt-1 block text-sm font-normal opacity-70 group-open:hidden">
					Click to expand
				</span>
			</summary>
			<div className="not-content border-t border-[var(--sl-color-accent-low)] bg-[var(--sl-color-background)] p-4">
				<div className="border-b border-[var(--sl-color-hairline)] pb-3 font-semibold text-[var(--sl-color-text)]">
					{name}
				</div>
				<div className="border-b border-[var(--sl-color-hairline)] py-3 text-[var(--sl-color-text)] leading-relaxed">
					{children}
				</div>
				<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
					<span className="opacity-90">{tags}</span>
					<span className="font-medium text-[var(--sl-color-accent)]">
						{payout}
					</span>
				</div>
			</div>
		</details>
	);
}
