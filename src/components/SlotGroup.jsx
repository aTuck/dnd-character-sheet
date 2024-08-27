import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { v4 as uuid } from "uuid";
import { useSlotItemRegistry } from "../hooks/useSlotItemRegistry";

const SlotGroup = ({ children }) => {
  const itemsRef = useRef({});
  const slotsRef = useRef({});

  const [isGlowingRegistry, setIsGlowingRegistry] = useState({});
  const [slotMappings, setSlotMappings] = useState({});
  const [itemPositionsOnLoad, setItemPositionsOnLoad] = useState({});
  const [slotPositionsOnLoad, setSlotPositionsOnLoad] = useState({});

  const handleOnPickup = (itemRef, itemId) => {
    Object.keys(slotMappings).forEach((slotId) => {
      const mappedItemId = slotMappings[slotId];
      if (mappedItemId === itemId) {
        console.log(`${itemId} was slotted, picked up`);
        const item = itemsRef.current[itemId];
        if (item) {
          setSlotMappings({ ...slotMappings, [slotId]: "" });
        }
      }
    });
  };

  const handleOnSlot = (itemRef, itemId) => {
    console.log("onSlot model", itemId);
    if (itemRef.current) {
      const itemBox = new THREE.Box3().setFromObject(itemRef.current);
      Object.keys(slotsRef.current).forEach((slotId) => {
        const slotBox = new THREE.Box3().setFromObject(
          slotsRef.current[slotId]
        );
        if (itemBox.intersectsBox(slotBox)) {
          console.log(`slotted ${itemId}!`);
          setSlotMappings({ ...slotMappings, [slotId]: itemId });
        }
      });
    }
  };

  const handleOnMove = (itemRef, itemId) => {
    console.log("onMove model", itemId);
    Object.keys(slotsRef.current).forEach((slotId) => {
      const slotBox = new THREE.Box3().setFromObject(slotsRef.current[slotId]);
      const itemBox = new THREE.Box3().setFromObject(itemRef.current);
      if (itemBox.intersectsBox(slotBox)) {
        setIsGlowingRegistry((registry) => ({
          ...registry,
          [slotId]: { ...registry[slotId], [itemId]: true },
        }));
      } else {
        setIsGlowingRegistry((registry) => ({
          ...registry,
          [slotId]: { ...registry[slotId], [itemId]: false },
        }));
      }
      console.log(isGlowingRegistry);
    });
  };

  const handleReceiveItemModel = (modelId, modelRef) => {
    itemsRef.current = { ...itemsRef.current, [modelId]: modelRef };
  };

  const handleReceiveSlotModel = (modelId, modelRef) => {
    slotsRef.current = { ...slotsRef.current, [modelId]: modelRef };
    console.log("received slots, ", slotsRef.current);
  };

  // query 3d models for world positions
  useFrame(() => {
    const updateItemPositions = () => {
      const newItemPositions = {};

      for (const key in itemsRef.current) {
        if (itemsRef.current.hasOwnProperty(key)) {
          const model = itemsRef.current[key];
          const position = new THREE.Vector3();
          if (model && model?.getWorldPosition) {
            model.getWorldPosition(position);
          }

          newItemPositions[key] = position;
        }
      }

      setItemPositionsOnLoad(newItemPositions);
    };

    const updateSlotPositions = () => {
      const newSlotPositions = {};

      for (const key in slotsRef.current) {
        if (slotsRef.current.hasOwnProperty(key)) {
          const model = slotsRef.current[key];
          const position = new THREE.Vector3();
          if (model && model?.getWorldPosition) {
            model.getWorldPosition(position);
          }

          newSlotPositions[key] = position;
        }
      }

      setSlotPositionsOnLoad(newSlotPositions);
    };

    updateItemPositions();
    updateSlotPositions();
  });

  // pull items towards their slots
  useFrame(() => {
    Object.keys(slotsRef.current).forEach((slotId) => {
      if (slotsRef.current[slotId]) {
        const itemId = slotMappings[slotId];
        const item = itemsRef.current[itemId];
        if (item) {
          const stiffness = 0.1; // How strong the spring is (higher = stronger, faster)
          const damping = 0.7; // Damping factor to slow down the spring (0-1, closer to 1 = slower)

          const positionDifference = new THREE.Vector3().subVectors(
            slotPositionsOnLoad[slotId],
            itemPositionsOnLoad[itemId]
          );

          // Apply spring formula: velocity += difference * stiffness; position += velocity; velocity *= damping;
          const velocity = positionDifference.multiplyScalar(stiffness);
          item.position.add(velocity);
          item.position.z += 0.75;
          velocity.multiplyScalar(damping);
        }
      }
    });
  });

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type.displayName === "SlotItem") {
      return React.cloneElement(child, {
        onPickup: handleOnPickup,
        onSlot: handleOnSlot,
        onMove: handleOnMove,
        sendModelToParent: handleReceiveItemModel,
      });
    }
    if (child.type.displayName === "SlotSlot") {
      return React.cloneElement(child, {
        setModel: () => {},
        checkIsGlowing: (modelId) => {
          return (
            isGlowingRegistry[modelId] &&
            Object.values(isGlowingRegistry[modelId]).some(
              (value) => value === true
            )
          );
        },
        sendSlotModelToParent: handleReceiveSlotModel,
      });
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
