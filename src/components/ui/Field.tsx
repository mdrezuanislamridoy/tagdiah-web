import React from 'react';
import { cx } from '../../utils/format';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  className?: string;
}

export function Field({ label, hint, className, id, ...rest }: FieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div className={cx('flex flex-col', className)}>
      <label htmlFor={fieldId} className="eyebrow mb-2 text-bark">
        {label}
      </label>
      <input
        id={fieldId}
        className="h-11 border border-dune bg-warmwhite px-3.5 text-sm text-ink placeholder:text-dune transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
        {...rest} />
      
      {hint && <p className="mt-1.5 text-xs text-smoke">{hint}</p>}
    </div>);

}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
}

export function TextArea({ label, className, id, ...rest }: TextAreaProps) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div className={cx('flex flex-col', className)}>
      <label htmlFor={fieldId} className="eyebrow mb-2 text-bark">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={5}
        className="border border-dune bg-warmwhite px-3.5 py-3 text-sm text-ink placeholder:text-dune transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
        {...rest} />
      
    </div>);

}