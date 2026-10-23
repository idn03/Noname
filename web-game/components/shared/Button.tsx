import type { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'default' | 'mobile';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

export function Button({ className = '', size = 'default', ...props }: ButtonProps) {
  const classes = ['shared-button', `shared-button--${size}`, className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}
