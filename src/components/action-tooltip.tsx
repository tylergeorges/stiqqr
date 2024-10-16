'use client';

import { forwardRef } from 'react';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
  type TooltipElement
} from '@/components/ui/tooltip';

interface ActionTooltipProps {
  children: React.ReactNode;
  label: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export const ActionTooltip = forwardRef<TooltipElement, ActionTooltipProps>(
  ({ children, label, side = 'top', align = 'center' }, ref) => {
    return (
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>

          <TooltipPortal>
            <TooltipContent side={side} align={align} ref={ref}>
              <p className="text-xs font-medium capitalize">{label}</p>

              <TooltipArrow className="fill-popover" />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ActionTooltip.displayName = 'ActionTooltip';
