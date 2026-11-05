import type { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'default' | 'mobile';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

export function Button({ className = '', size = 'default', ...props }: ButtonProps) {
  const classes = ['cursor-pointer rounded-[var(--radius-control)] border-x-[6px] border-t-4 border-b-[10px] bg-transparent text-inherit [font:inherit] transition-[background-color,border-color,color,transform] duration-[220ms] ease-[ease] enabled:active:translate-y-px focus-visible:[outline-width:var(--outline-width-focus)] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-[.65] max-[700px]:border-x-2 max-[700px]:border-t max-[700px]:border-b-4', size === 'mobile' ? 'border-x-2 border-t border-b-4' : '', className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
