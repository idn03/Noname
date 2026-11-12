import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';

type ButtonSize = 'default' | 'mobile';
type ButtonVariant = 'default' | 'outline' | 'mobile' | 'small' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({ className = '', size = 'default', variant = 'default', ...props }: ButtonProps) {
  const wasDisabled = useRef(Boolean(props.disabled));
  const [justEnabled, setJustEnabled] = useState(false);

  useEffect(() => {
    if (wasDisabled.current && !props.disabled) {
      setJustEnabled(true);
      const timeout = window.setTimeout(() => setJustEnabled(false), 500);
      wasDisabled.current = false;
      return () => window.clearTimeout(timeout);
    }
    wasDisabled.current = Boolean(props.disabled);
  }, [props.disabled]);

  const compact = size === 'mobile' || variant === 'mobile';
  const shape = variant === 'small'
    ? 'border-x-4 border-t-2 border-b-[6px] bg-transparent'
    : variant === 'ghost'
    ? 'border-0 bg-transparent'
    : compact
      ? 'border-x-2 border-t border-b-4 bg-transparent'
      : 'border-x-[6px] border-t-4 border-b-[10px] bg-transparent max-[700px]:border-x-2 max-[700px]:border-t max-[700px]:border-b-4';
  const sizeClasses = variant === 'small' ? 'py-5 text-title1' : '';
  const hoverClasses = variant === 'small'
    ? 'hover:border-b-2 hover:border-white'
    : variant === 'default'
      ? 'hover:border-b-4 hover:border-white'
      : '';
  const classes = ['cursor-pointer rounded-[var(--radius-control)]', shape, sizeClasses, 'text-inherit [font-family:inherit] transition-[background-color,border-color,color,transform] duration-500 ease-[ease] enabled:active:translate-y-px focus-visible:[outline-width:var(--outline-width-focus)] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-[.65]', hoverClasses, justEnabled ? 'animate-[button-enable-bounce_500ms_ease-out] motion-reduce:animate-none' : '', className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
