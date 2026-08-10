import type { ReactNode } from 'react';

type SectionTitleProps = {
  id?: string;
  children: ReactNode;
  count?: ReactNode;
};

export function SectionTitle({ id, children, count }: SectionTitleProps) {
  return (
    <h2 id={id} className="mb-2 flex items-baseline gap-3">
      <span className="font-display text-[1.75rem] leading-none tracking-[-0.01em] italic">
        {children}
      </span>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      {count != null ? (
        <span className="font-mono text-[0.7rem] tracking-[0.08em] text-muted uppercase">
          {count}
        </span>
      ) : null}
    </h2>
  );
}

export function SectionLede({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 max-w-xl text-[0.95rem] text-muted">{children}</p>
  );
}
