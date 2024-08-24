import React, { useRef, useState } from "react";
import * as THREE from "three";

const SlotGroup = ({ children }) => {
  const slotItemRef = useRef();
  const slotSlotRef = useRef();
  const [isSlotted, setIsSlotted] = useState(false);

  const handlePickup = (pickedUpItemRef) => {
    if (isSlotted) {
      console.log("was slotted, copying item to slot");
      setIsSlotted(false);
      pickedUpItemRef.current.position.copy(slotSlotRef.current.position);
      pickedUpItemRef.current.position.z =
        slotSlotRef.current.position.z + 5.01;
    }
  };

  const handleSlot = () => {
    if (slotItemRef.current && slotSlotRef.current && !isSlotted) {
      console.log("maybe slot");
      const itemBox = new THREE.Box3().setFromObject(slotItemRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotSlotRef.current);

      if (itemBox.intersectsBox(slotBox)) {
        console.log("slotted!");
        slotItemRef.current.position.copy(slotSlotRef.current.position);
        slotItemRef.current.position.z = slotSlotRef.current.position.z + 5.01;
        setIsSlotted(true);
      }
    }
  };

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type.displayName === "SlotItem") {
      return React.cloneElement(child, {
        onPickup: handlePickup,
        onSlot: handleSlot,
        ref: slotItemRef,
      });
    }
    if (child.type.displayName === "SlotSlot") {
      return React.cloneElement(child, { ref: slotSlotRef });
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
