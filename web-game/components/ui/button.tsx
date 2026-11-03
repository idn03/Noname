import type { ButtonHTMLAttributes } from 'react';
import { Button as SharedButton } from '../shared/Button';

type ButtonVariant = 'default' | 'outline' | 'ghost';
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> & {
  variant?: ButtonVariant;
  size?: 'default' | 'mobile';
};

export function Button({ className = '', variant = 'default', ...props }: ButtonProps) {
  return <SharedButton className={`ui-button ui-button--${variant} ${className}`} {...props} />;
}
