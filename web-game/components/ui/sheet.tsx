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
    <Dialog.Backdrop data-slot="sheet-overlay" className="fixed inset-0 z-50 bg-[rgb(0_0_0/.62)] transition-opacity duration-150 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none" />
    <Dialog.Viewport className="pointer-events-none fixed inset-0 z-[51] flex items-end justify-center overflow-hidden">
      <Dialog.Popup data-slot="sheet-content" data-side={side} className={cn('pointer-events-auto relative max-h-[min(82dvh,720px)] w-[min(100%,640px)] overflow-auto border border-[#30282a] bg-white text-[#161313] font-judson shadow-[0_-12px_50px_rgb(0_0_0/.26)] outline-none data-[side=bottom]:w-[min(100%,640px)] data-[side=top]:w-[min(100%,640px)] data-[side=bottom]:self-end data-[side=bottom]:rounded-t-[20px] data-[side=bottom]:border-b-0 data-[side=top]:self-start data-[side=top]:rounded-b-[20px] data-[side=top]:border-t-0 data-[side=left]:h-dvh data-[side=left]:max-h-dvh data-[side=left]:w-[min(88vw,420px)] data-[side=left]:self-stretch data-[side=left]:mr-auto data-[side=left]:border-l-0 data-[side=right]:h-dvh data-[side=right]:max-h-dvh data-[side=right]:w-[min(88vw,420px)] data-[side=right]:self-stretch data-[side=right]:ml-auto data-[side=right]:border-r-0 motion-reduce:transition-none', motionClasses, className)} {...props}>
        {children}
        {showCloseButton && <Dialog.Close className="absolute top-[11px] right-4 grid size-10 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-[#722f37] focus-visible:outline-2 focus-visible:outline-[#722f37] focus-visible:outline-offset-2 [&_svg]:size-5" aria-label="Đóng bảng thử thách"><XIcon aria-hidden="true" /></Dialog.Close>}
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>;
}

function SheetHeader({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

function SheetFooter({ className = '', ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('mt-[22px] flex items-center justify-end gap-[10px]', className)} {...props} />;
}

function SheetTitle(props: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription(props: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description data-slot="sheet-description" {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
