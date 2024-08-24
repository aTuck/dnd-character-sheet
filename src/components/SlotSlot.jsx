import React, { forwardRef } from "react";

const SlotSlot = forwardRef(({ children, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    ...props,
  });
});

SlotSlot.displayName = "SlotSlot";

export default SlotSlot;
