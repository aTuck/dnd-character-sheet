import React, { useRef, useState, useMemo, useEffect, ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SlotGroupProps {
  children: ReactNode;
}

interface ItemRefMap {
  [key: string]: THREE.Object3D;
}

interface SlotMappings {
  [key: string]: string | null;
}

interface IsGlowingRegistry {
  [key: string]: { [key: string]: boolean };
}

interface PositionMap {
  [key: string]: THREE.Vector3;
}

const SlotGroup: React.FC<SlotGroupProps> = ({ children }) => {
  const itemsRef = useRef<ItemRefMap>({});
  const slotsRef = useRef<ItemRefMap>({});

  const [slotMappings, setSlotMappings] = useState<SlotMappings>({});
  const [isGlowingRegistry, setIsGlowingRegistry] = useState<IsGlowingRegistry>(
    {}
  );
  const [itemPositionsOnLoad, setItemPositionsOnLoad] = useState<PositionMap>(
    {}
  );
  const [slotPositionsOnLoad, setSlotPositionsOnLoad] = useState<PositionMap>(
    {}
  );
  const [isLocked, setIsLocked] = useState(false);

  const handleOnPickup = (
    itemRef: React.MutableRefObject<THREE.Object3D | null>,
    itemId: string
  ) => {
    Object.keys(slotMappings).forEach((slotId) => {
      const mappedItemId = slotMappings[slotId];
      if (mappedItemId === itemId) {
        console.log(`${itemId} was slotted, picked up`);
        const item = itemsRef?.current[itemId];
        if (item) {
          setSlotMappings({ ...slotMappings, [slotId]: null });
        }
      }
    });
  };

  const handleOnSlot = (
    itemRef: React.MutableRefObject<THREE.Object3D | null>,
    itemId: string
  ) => {
    console.log("onSlot model", itemId);
    if (itemRef?.current) {
      const itemBox = new THREE.Box3().setFromObject(itemRef?.current);
      Object.keys(slotsRef?.current).forEach((slotId) => {
        const slotBox = new THREE.Box3().setFromObject(
          slotsRef?.current[slotId]
        );
        if (itemBox.intersectsBox(slotBox)) {
          console.log(`slotted ${itemId}!`);
          setSlotMappings({ ...slotMappings, [slotId]: itemId });
        }
      });
    }
  };

  const handleOnMove = (
    itemRef: React.MutableRefObject<THREE.Object3D | null>,
    itemId: string
  ) => {
    console.log("onMove model", itemId);
    Object.keys(slotsRef?.current).forEach((slotId) => {
      if (slotId) {
        const slotBox = new THREE.Box3().setFromObject(
          slotsRef?.current[slotId]
        );
        const itemBox = new THREE.Box3().setFromObject(itemRef?.current!);
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
      }
    });
  };

  const handleOnCast = (slotId: string, slotLevel: number) => {
    console.log(slotId, slotMappings);
    const itemId = slotMappings[slotId];
    const item = itemsRef?.current[slotMappings[slotId]!];
    console.log(itemId, itemsRef?.current, "asdf");
    console.log("casting", item);
  };

  const handleReceiveItemModel = (
    modelId: string,
    modelRef: React.MutableRefObject<THREE.Object3D>
  ) => {
    itemsRef.current = { ...itemsRef?.current, [modelId]: modelRef?.current };
  };

  const handleReceiveSlotModel = (modelId: string, model: THREE.Object3D) => {
    slotsRef.current = { ...slotsRef.current, [modelId]: model };
    console.log("received slots, ", slotsRef.current);
  };

  useFrame(() => {
    const updateItemPositions = () => {
      const newItemPositions: PositionMap = {};

      for (const key in itemsRef?.current) {
        const model = itemsRef?.current[key];
        if (model) {
          const position = new THREE.Vector3();
          model.getWorldPosition(position);
          newItemPositions[key] = position;
        }
      }

      setItemPositionsOnLoad(newItemPositions);
    };

    const updateSlotPositions = () => {
      const newSlotPositions: PositionMap = {};

      for (const key in slotsRef?.current) {
        const model = slotsRef?.current[key];
        if (model) {
          const position = new THREE.Vector3();
          model.getWorldPosition(position);
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
    Object.keys(slotsRef?.current).forEach((slotId) => {
      if (slotsRef.current[slotId]) {
        const itemId = slotMappings[slotId];
        const item = itemsRef?.current[itemId!];
        if (item) {
          console.log("pulling", item);
          const stiffness = 0.1;
          const damping = 0.7;

          const positionDifference = new THREE.Vector3().subVectors(
            slotPositionsOnLoad[slotId],
            itemPositionsOnLoad[itemId!]
          );

          const velocity = positionDifference.multiplyScalar(stiffness);
          item.position.add(velocity);
          item.position.z += 0.75;
          velocity.multiplyScalar(damping);
        }
      }
    });
  });

  const checkIsGlowing = (modelId: string) => {
    return (
      isGlowingRegistry[modelId] &&
      Object.values(isGlowingRegistry[modelId]).some((value) => value === true)
    );
  };

  const checkRenderCastButton = (slotId: string) => {
    return slotMappings[slotId] != null;
  };

  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type && (child.type as any).displayName === "SlotItem") {
        return React.cloneElement(child, {
          onPickup: handleOnPickup,
          onSlot: handleOnSlot,
          onMove: handleOnMove,
          sendModelToParent: handleReceiveItemModel,
        } as Record<string, any>);
      }
      if (child.type && (child.type as any).displayName === "SlotSlot") {
        return React.cloneElement(child, {
          setModel: () => {},
          onCast: handleOnCast,
          checkIsGlowing: checkIsGlowing,
          checkRenderCastButton: checkRenderCastButton,
          sendSlotModelToParent: handleReceiveSlotModel,
        } as Record<string, any>);
      }
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SlotGroup;
