import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { v4 as uuid } from "uuid";
import { useSlotItemRegistry } from "../hooks/useSlotItemRegistry";

const SlotGroup = ({ children }) => {
  const itemsRef = useRef({});
  const slotsRef = useRef({});
  const slotSlotRef = useRef();

  const [isGlowing, setIsGlowing] = useState(false);
  const [slotMappings, setSlotMappings] = useState({});
  const [itemPositions, setItemPositions] = useState({});
  const [slotPositions, setSlotPositions] = useState({});

  const [slotItems, setSlotItemById, setSlotItemIsSlottedById] =
    useSlotItemRegistry();

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
          setSlotItemIsSlottedById(itemId, true);

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
        setIsGlowing(true);
      } else {
        setIsGlowing(false);
      }
    });
  };

  const handleReceiveModel = (modelId, modelRef) => {
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

      setItemPositions(newItemPositions);
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

      setSlotPositions(newSlotPositions);
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

          const slotPosition = slotPositions[slotId];
          console.log(item.position);
          const positionDifference = new THREE.Vector3().subVectors(
            slotPositions[slotId],
            itemPositions[itemId]
          );
          // Apply spring formula: velocity += difference * stiffness; position += velocity; velocity *= damping;
          const velocity = positionDifference.multiplyScalar(stiffness);
          item.position.add(velocity);
          item.position.multiplyScalar(damping);
          console.log("updated", item.position);
        }
      }
    });
  });

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type.displayName === "SlotItem") {
      return React.cloneElement(child, {
        setModel: setSlotItemById,
        onPickup: handleOnPickup,
        onSlot: handleOnSlot,
        onMove: handleOnMove,
        sendModelToParent: handleReceiveModel,
      });
    }
    if (child.type.displayName === "SlotSlot") {
      return React.cloneElement(child, {
        setModel: () => {},
        isGlowing: isGlowing,
        sendSlotModelToParent: handleReceiveSlotModel,
      });
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
