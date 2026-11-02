'use client';

import * as React from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { cn } from 'cn';

function Sheet(props: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="sheet" {...props} />;
}

type SheetContentProps = React.ComponentProps<typeof Dialog.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};

function SheetContent({ className, children, side = 'bottom', ...props }: SheetContentProps) {
  return <Dialog.Portal>
    <Dialog.Backdrop data-slot="sheet-overlay" className="sheet-overlay" />
    <Dialog.Viewport className="sheet-viewport">
      <Dialog.Popup data-slot="sheet-content" data-side={side} className={cn('sheet-content', className)} {...props}>
        <span className="sheet-handle" aria-hidden="true" />
        <Dialog.Close className="sheet-close" aria-label="Đóng bảng thử thách">Đóng</Dialog.Close>
        {children}
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>;
}

function SheetTitle(props: React.ComponentProps<typeof Dialog.Title>) {
  return <Dialog.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription(props: React.ComponentProps<typeof Dialog.Description>) {
  return <Dialog.Description data-slot="sheet-description" {...props} />;
}

export { Sheet, SheetContent, SheetDescription, SheetTitle };
