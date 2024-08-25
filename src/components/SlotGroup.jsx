import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const SlotGroup = ({ children }) => {
  const slotItemRef = useRef();
  const slotSlotRef = useRef();
  const [isSlotted, setIsSlotted] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const handlePickup = (pickedUpItemRef) => {
    if (isSlotted) {
      console.log("was slotted, copying item to slot");
      setIsSlotted(false);
      pickedUpItemRef.current.position.copy(slotSlotRef.current.position);
    }
  };

  const handleSlot = (itemRef) => {
    if (itemRef.current && slotSlotRef.current && !isSlotted) {
      console.log("maybe slot");
      const itemBox = new THREE.Box3().setFromObject(itemRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotSlotRef.current);

      if (itemBox.intersectsBox(slotBox)) {
        console.log("slotted!");
        setIsSlotted(true);
      }
    }
  };

  const handleMove = (itemRef) => {
    if (itemRef.current && !isSlotted) {
      const itemBox = new THREE.Box3().setFromObject(itemRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotSlotRef.current);
      if (itemBox.intersectsBox(slotBox)) {
        setIsGlowing(true);

        const itemPosition = itemRef.current.position.clone();

        const overlapZ = Math.max(
          0,
          Math.min(itemBox.max.z, slotBox.max.z) -
            Math.max(itemBox.min.z, slotBox.min.z)
        );

        console.log(itemBox, slotBox, overlapZ);
        // Adjust position if the item is moving out of bounds
        if (overlapZ > 0) {
          itemPosition.z = Math.min(
            slotBox.min.z,
            Math.max(
              itemPosition.z,
              slotBox.max.z - (itemBox.max.z - itemBox.min.z)
            )
          );
        }

        // Update the item's position
        itemRef.current.position.set(
          itemPosition.x,
          itemPosition.y,
          itemPosition.z
        );
      } else {
        setIsGlowing(false);
      }
    }
  };

  useFrame(() => {
    if (isSlotted) {
      const stiffness = 0.1; // How strong the spring is (higher = stronger, faster)
      const damping = 0.7; // Damping factor to slow down the spring (0-1, closer to 1 = slower)

      const positionDifference = new THREE.Vector3().subVectors(
        slotSlotRef.current.position,
        slotItemRef.current.position
      );

      // Apply spring formula: velocity += difference * stiffness; position += velocity; velocity *= damping;
      const velocity = positionDifference.multiplyScalar(stiffness);
      slotItemRef.current.position.add(velocity);
      slotItemRef.current.position.multiplyScalar(damping);

      // Ensure Z position is above the slot by a fixed amount
    }
    if (slotItemRef.current && slotSlotRef.current) {
      slotItemRef.current.position.z = slotSlotRef.current.position.z + 10;
    }
  });

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type.displayName === "SlotItem") {
      return React.cloneElement(child, {
        onPickup: handlePickup,
        onSlot: handleSlot,
        onMove: handleMove,
        ref: slotItemRef,
      });
    }
    if (child.type.displayName === "SlotSlot") {
      return React.cloneElement(child, {
        isGlowing: isGlowing,
        ref: slotSlotRef,
      });
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
