import type { ButtonHTMLAttributes } from 'react';

type PressableTextProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PressableText({ className = '', type = 'button', ...props }: PressableTextProps) {
  const classes = ['min-h-11 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit [font-family:inherit] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:decoration-current focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 disabled:cursor-wait disabled:opacity-[.65]', className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} type={type} {...props} />;
}
