import React from 'react';
import { Button, ButtonLink } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  actionTo,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center border border-dashed border-dune px-8 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linen text-bark">
        {icon}
      </div>
      <h3 className="mt-6 font-display text-2xl font-light text-ink">{title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">{body}</p>
      {actionLabel && onAction &&
      <Button className="mt-8" onClick={onAction}>
          {actionLabel}
        </Button>
      }
      {actionLabel && actionTo && !onAction &&
      <ButtonLink to={actionTo} className="mt-8">
          {actionLabel}
        </ButtonLink>
      }
    </div>);

}