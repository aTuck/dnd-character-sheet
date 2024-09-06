import React, { useRef, useState, useMemo, useEffect, ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SpellGroupProps {
  children: ReactNode;
}

interface Object3DRefMap {
  [key: string]: THREE.Object3D;
}

interface PositionMap {
  [key: string]: THREE.Vector3;
}

interface SlotMappings {
  [key: string]: string | null;
}

interface IsGlowingRegistry {
  [key: string]: { [key: string]: boolean };
}

const SpellGroup: React.FC<SpellGroupProps> = ({ children }) => {
  const spellCardsRef = useRef<Object3DRefMap>({});
  const spellSlotsRef = useRef<Object3DRefMap>({});

  const [slotMappings, setSlotMappings] = useState<SlotMappings>({});
  const [isGlowingRegistry, setIsGlowingRegistry] = useState<IsGlowingRegistry>(
    {}
  );
  const [cardPositionsOnLoad, setItemPositionsOnLoad] = useState<PositionMap>(
    {}
  );
  const [slotPositionsOnLoad, setSlotPositionsOnLoad] = useState<PositionMap>(
    {}
  );

  const handleOnPickup = (
    cardRef: React.MutableRefObject<THREE.Object3D | null>,
    cardId: string
  ) => {
    Object.keys(slotMappings).forEach((slotId) => {
      const slottedCardId = slotMappings[slotId];
      if (slottedCardId === cardId) {
        console.log(`${cardId} picked up`);
        if (spellCardsRef?.current[cardId]) {
          setSlotMappings({ ...slotMappings, [slotId]: null });
        }
      }
    });
  };

  const handleOnSlot = (
    cardRef: React.MutableRefObject<THREE.Object3D | null>,
    cardId: string
  ) => {
    console.log("onSlot model", cardId);
    if (cardRef?.current) {
      const cardBox = new THREE.Box3().setFromObject(cardRef?.current);
      Object.keys(spellSlotsRef?.current).forEach((slotId) => {
        const slotBox = new THREE.Box3().setFromObject(
          spellSlotsRef?.current[slotId]
        );
        if (cardBox.intersectsBox(slotBox)) {
          console.log(`slotted ${cardId}!`);
          setSlotMappings({ ...slotMappings, [slotId]: cardId });
        }
      });
    }
  };

  const handleOnMove = (
    cardRef: React.MutableRefObject<THREE.Object3D | null>,
    cardId: string
  ) => {
    console.log("onMove model", cardId);
    Object.keys(spellSlotsRef?.current).forEach((slotId) => {
      if (slotId) {
        const slotBox = new THREE.Box3().setFromObject(
          spellSlotsRef?.current[slotId]
        );
        const cardBox = new THREE.Box3().setFromObject(cardRef?.current!);
        if (cardBox.intersectsBox(slotBox)) {
          setIsGlowingRegistry((registry) => ({
            ...registry,
            [slotId]: { ...registry[slotId], [cardId]: true },
          }));
        } else {
          setIsGlowingRegistry((registry) => ({
            ...registry,
            [slotId]: { ...registry[slotId], [cardId]: false },
          }));
        }
      }
    });
  };

  const handleOnCast = (slotId: string, slotLevel: number) => {
    const card = spellCardsRef?.current[slotMappings[slotId]!];
    console.log("casting", card);
  };

  const handleReceiveCardObject3D = (
    cardId: string,
    object3D: THREE.Object3D
  ) => {
    spellCardsRef.current = {
      ...spellCardsRef?.current,
      [cardId]: object3D,
    };
  };

  const handleReceiveSlotObject3D = (
    slotId: string,
    object3D: THREE.Object3D
  ) => {
    spellSlotsRef.current = { ...spellSlotsRef.current, [slotId]: object3D };
    console.log("received slots, ", spellSlotsRef.current);
  };

  useFrame(() => {
    const updateCardPositions = () => {
      const newCardPositions: PositionMap = {};

      for (const key in spellCardsRef?.current) {
        const cardObject3D = spellCardsRef?.current[key];
        if (cardObject3D) {
          const position = new THREE.Vector3();
          cardObject3D.getWorldPosition(position);
          newCardPositions[key] = position;
        }
      }

      setItemPositionsOnLoad(newCardPositions);
    };

    const updateSlotPositions = () => {
      const newSlotPositions: PositionMap = {};

      for (const key in spellSlotsRef?.current) {
        const model = spellSlotsRef?.current[key];
        if (model) {
          const position = new THREE.Vector3();
          model.getWorldPosition(position);
          newSlotPositions[key] = position;
        }
      }

      setSlotPositionsOnLoad(newSlotPositions);
    };

    updateCardPositions();
    updateSlotPositions();
  });

  // pull items towards their slots
  useFrame(() => {
    Object.keys(spellSlotsRef?.current).forEach((slotId) => {
      if (spellSlotsRef.current[slotId]) {
        const cardId = slotMappings[slotId];
        const card = spellCardsRef?.current[cardId!];
        if (card) {
          console.log("pulling", card);

          const stiffness = 0.1;
          const damping = 0.7;

          const positionDifference = new THREE.Vector3().subVectors(
            slotPositionsOnLoad[slotId],
            cardPositionsOnLoad[cardId!]
          );

          const velocity = positionDifference.multiplyScalar(stiffness);
          card.position.add(velocity);
          card.position.z += 0.75;
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
          sendCardObject3DToParent: handleReceiveCardObject3D,
        } as Record<string, any>);
      }
      if (child.type && (child.type as any).displayName === "SlotSlot") {
        return React.cloneElement(child, {
          setModel: () => {},
          onCast: handleOnCast,
          checkIsGlowing: checkIsGlowing,
          checkRenderCastButton: checkRenderCastButton,
          sendSlotObject3DToParent: handleReceiveSlotObject3D,
        } as Record<string, any>);
      }
    }
    return child;
  });

  return <>{clonedChildren}</>;
};

export default SpellGroup;
