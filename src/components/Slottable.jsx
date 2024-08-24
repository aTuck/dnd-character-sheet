import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CSS } from "../statics/values";
import * as THREE from "three";

function Slottable({ children, onSlot }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isSlotted, setIsSlotted] = useState(false);

  const slotRef = useRef();
  const cardRef = useRef();

  const handleDragStart = (object) => {
    if (object === cardRef.current && isSlotted) {
      setIsSlotted(false);
      console.log("dragstart pos", cardRef.current.position);
      object.position.copy(slotRef.current.position);
      object.position.z = slotRef.current.position.z;
    }
  };

  const handleDragEnd = (object) => {
    if (object === cardRef.current) {
      console.log("dragend pos", cardRef.current.position);

      // Check if card was dropped over the slot
      const cardBox = new THREE.Box3().setFromObject(cardRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotRef.current);

      if (cardBox.intersectsBox(slotBox)) {
        // Snap the card to the slot position
        object.position.copy(slotRef.current.position);
        object.position.z = slotRef.current.position.z + 5.01;

        if (onSlot) {
          setIsSlotted(true);
          onSlot(object, slotRef.current);
        }
      }
    }
  };

  const onMove = (object) => {
    if (object === cardRef.current) {
      // Check if card was dropped over the slot
      const cardBox = new THREE.Box3().setFromObject(cardRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotRef.current);

      if (cardBox.intersectsBox(slotBox) && !isHovering) {
        console.log("turn on hovering effect");

        // onHoveringEffect(slotRef.current);
        setIsHovering(true);
      } else if (!cardBox.intersectsBox(slotBox) && isHovering) {
        console.log("turn off hovering effect");
        setIsHovering(false);
      }
    }
  };

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type.name === "SpellCard3dModel") {
      return React.cloneElement(child, {
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onMove: onMove,
        ref: cardRef,
      });
    }
    if (child.type.name === "SpellSlot3dModel") {
      return React.cloneElement(child, {
        ref: slotRef,
        onDragEnd: handleDragEnd,
        onMove: onMove,
        isHovering: isHovering,
      });
    }
    return child;
  });
  return <>{clonedChildren}</>;
}

export default Slottable;
