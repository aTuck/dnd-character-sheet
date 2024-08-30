import React, { forwardRef, ReactElement } from "react";

interface SpellCardProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactElement;
}

const SpellCard = forwardRef<HTMLElement, SpellCardProps>(
  ({ children, ...props }, ref) => {
    return React.cloneElement(children, {
      ref,
      ...props,
    });
  }
);

SpellCard.displayName = "SlotItem";

export default SpellCard;
