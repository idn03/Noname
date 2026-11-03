'use client';

import * as React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import { cn } from 'cn';

function Sheet(props: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="sheet-close" {...props} />;
}

type SheetContentProps = React.ComponentProps<typeof Dialog.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
};

function SheetContent({ className, children, side = 'right', showCloseButton = true, ...props }: SheetContentProps) {
  const motionClasses = 'transition-[opacity,transform] duration-300 ease-in-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=top]:data-ending-style:translate-y-[-2.5rem]';
  return <Dialog.Portal>
    <Dialog.Backdrop data-slot="sheet-overlay" className="sheet-overlay transition-opacity duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0" />
    <Dialog.Viewport className="sheet-viewport">
      <Dialog.Popup data-slot="sheet-content" data-side={side} className={cn('sheet-content', motionClasses, className)} {...props}>
        {children}
        {showCloseButton && <Dialog.Close className="sheet-close" aria-label="Đóng bảng thử thách"><XIcon aria-hidden="true" /></Dialog.Close>}
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>;
}

function SheetHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('sheet-header', className)} {...props} />;
}

function SheetFooter({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('sheet-footer', className)} {...props} />;
}

function SheetTitle(props: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription(props: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description data-slot="sheet-description" {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
