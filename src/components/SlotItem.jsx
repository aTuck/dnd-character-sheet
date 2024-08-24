import React, { forwardRef } from "react";

const SlotItem = forwardRef(({ children, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    ...props,
  });
});

SlotItem.displayName = "SlotItem";

export default SlotItem;
