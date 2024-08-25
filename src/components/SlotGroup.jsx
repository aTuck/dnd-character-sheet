import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { v4 as uuid } from "uuid";
import { useSlotItemRegistry } from "../hooks/useSlotItemRegistry";
import { useSlotSlotRegistry } from "../hooks/useSlotSlotRegistry";

const SlotGroup = ({ children }) => {
  const itemsRef = useRef({});
  const slotsRef = useRef({});
  const slotSlotRef = useRef();

  const [isGlowing, setIsGlowing] = useState(false);
  const [slotMappings, setSlotMappings] = useState({});
  const [itemPositions, setItemPositions] = useState({});

  const [slotItems, setSlotItemById, setSlotItemIsSlottedById] =
    useSlotItemRegistry();
  const [slotSlots, setSlotSlotModel, setSlotSlotSlottedItemId] =
    useSlotSlotRegistry();

  const handleOnPickup = (itemRef, itemId) => {
    Object.keys(slotMappings).forEach((slotId) => {
      const itemId = slotMappings[slotId];
      const item = itemsRef.current[itemId];
      if (item) {
        setSlotMappings({ ...slotMappings, [slotId]: "" });
        item.position.z -= 25;
      }
    });
    if (slotMappings) {
      console.log(`${itemId} was slotted, picked up`);
      setSlotItemIsSlottedById(itemId, false);
      setSlotSlotSlottedItemId(Object.keys(slotSlotRef.current)[0], "");
      // itemRef.current.position.copy(slotSlotRef.current.position);
    }
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
          setSlotSlotSlottedItemId(slotId, itemId);

          setSlotMappings({ ...slotMappings, [slotId]: itemId });
        }
      });
    }
  };

  const handleOnMove = (itemRef, itemId) => {
    console.log("onMove model", itemId);
    if (itemRef.current && !slotItems[itemId]?.isSlotted) {
      const itemBox = new THREE.Box3().setFromObject(itemRef.current);
      const slotBox = new THREE.Box3().setFromObject(slotSlotRef.current);
      if (itemBox.intersectsBox(slotBox)) {
        setIsGlowing(true);
      } else {
        setIsGlowing(false);
      }
    }
  };

  const handleReceiveModel = (modelId, modelRef) => {
    console.log("Received model:", modelId, modelRef);
    itemsRef.current = { ...itemsRef.current, [modelId]: modelRef };
    console.log("itemsRef", itemsRef.current);
  };

  const handleReceiveSlotModel = (modelId, modelRef) => {
    console.log("Received slot model:", modelId, modelRef);
    slotsRef.current = { ...slotsRef.current, [modelId]: modelRef };
    console.log("slotsRef", slotsRef.current);
  };

  // query 3d models for world positions
  useFrame(() => {
    const updateItemPositions = () => {
      const newPositions = {};

      for (const key in itemsRef.current) {
        if (itemsRef.current.hasOwnProperty(key)) {
          const model = itemsRef.current[key];
          const position = new THREE.Vector3();
          if (model && model?.getWorldPosition) {
            model.getWorldPosition(position);
          }

          newPositions[key] = position;
        }
      }

      setItemPositions(newPositions);
    };

    updateItemPositions();
  });

  useFrame(() => {
    Object.keys(slotsRef.current).forEach((slotId) => {
      if (slotsRef.current[slotId]) {
        const itemId = slotMappings[slotId];
        const item = itemsRef.current[itemId];
        if (item) {
          const stiffness = 0.1; // How strong the spring is (higher = stronger, faster)
          const damping = 0.7; // Damping factor to slow down the spring (0-1, closer to 1 = slower)

          console.log(slotsRef.current[slotId].position, item.position);
          const positionDifference = new THREE.Vector3().subVectors(
            slotsRef.current[slotId].position,
            itemPositions[itemId]
          );

          // Apply spring formula: velocity += difference * stiffness; position += velocity; velocity *= damping;
          const velocity = positionDifference.multiplyScalar(stiffness);
          item.position.add(velocity);
          item.position.multiplyScalar(damping);
          item.position.z += 10;
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
        setModel: setSlotSlotModel,
        isGlowing: isGlowing,
        sendModelToParent: handleReceiveSlotModel,
        ref: slotSlotRef,
      });
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
