import type { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'default' | 'mobile';
type ButtonVariant = 'default' | 'outline' | 'mobile' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({ className = '', size = 'default', variant = 'default', ...props }: ButtonProps) {
  const shape = variant === 'ghost'
    ? 'border-0 bg-transparent'
    : 'border-x-[6px] border-t-4 border-b-[10px] bg-transparent';
  const mobile = size === 'mobile' || variant === 'mobile' ? 'border-x-2 border-t border-b-4' : 'max-[700px]:border-x-2 max-[700px]:border-t max-[700px]:border-b-4';
  const classes = ['cursor-pointer rounded-[var(--radius-control)]', shape, 'text-inherit [font-family:inherit] transition-[background-color,border-color,color,transform] duration-[220ms] ease-[ease] enabled:active:translate-y-px focus-visible:[outline-width:var(--outline-width-focus)] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-[.65]', mobile, className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
