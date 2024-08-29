import React, { forwardRef, ReactElement } from "react";

interface SlotItemProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactElement;
}

const SlotItem = forwardRef<HTMLElement, SlotItemProps>(
  ({ children, ...props }, ref) => {
    return React.cloneElement(children, {
      ref,
      ...props,
    });
  }
);

SlotItem.displayName = "SlotItem";

export default SlotItem;