import React, { forwardRef, ReactElement } from "react";

interface SlotSlotProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactElement;
}

const SlotSlot = forwardRef<HTMLElement, SlotSlotProps>(
  ({ children, ...props }, ref) => {
    return React.cloneElement(children, {
      ref,
      ...props,
    });
  }
);

SlotSlot.displayName = "SlotSlot";

export default SlotSlot;
