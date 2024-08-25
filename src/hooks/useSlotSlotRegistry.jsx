import React, { createContext, useContext, useState } from "react";

const SlotSlotContext = createContext();

export const SlotSlotRegistryProvider = ({ children }) => {
  const [slotSlots, setSlotSlots] = useState({});

  const setSlotSlot = (slotSlotId, newSlotSlot) => {
    console.log("slotSlotRegistry: Setting slotSlot", slotSlotId);
    setSlotSlots((slotSlots) => ({
      ...slotSlots,
      [slotSlotId]: {
        ...newSlotSlot,
      },
    }));
  };

  const setSlotSlotModel = (slotSlotId, model) => {
    console.log("slotSlotRegistry: Setting hasItemSlotted", slotSlotId, model);
    setSlotSlots((slotSlots) => ({
      ...slotSlots,
      [slotSlotId]: {
        ...slotSlots[slotSlotId],
        model: model,
      },
    }));
  };

  const setSlotSlotSlottedItemId = (slotSlotId, slottedItemId) => {
    console.log("slotSlotRegistry: Setting slottedItemId", slottedItemId);
    setSlotSlots((slotSlots) => ({
      ...slotSlots,
      [slotSlotId]: {
        ...slotSlots[slotSlotId],
        slottedItemId: slottedItemId,
      },
    }));
  };

  return (
    <SlotSlotContext.Provider
      value={{
        slotSlots,
        setSlotSlotModel,
        setSlotSlotSlottedItemId,
      }}
    >
      {children}
    </SlotSlotContext.Provider>
  );
};

export const useSlotSlotRegistry = () => {
  const { slotSlots, setSlotSlotModel, setSlotSlotSlottedItemId } =
    useContext(SlotSlotContext);
  return [slotSlots, setSlotSlotModel, setSlotSlotSlottedItemId];
};
