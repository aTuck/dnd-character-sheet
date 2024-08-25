import React, { createContext, useContext, useState } from "react";

const SlotItemContext = createContext();

export const SlotItemRegistryProvider = ({ children }) => {
  const [slotItems, setSlotItems] = useState({});

  const setSlotItemById = (slotItemId, slotItem) => {
    console.log("slotItemRegistry: Setting slotItem", slotItemId);
    setSlotItems((slotItems) => ({
      ...slotItems,
      [slotItemId]: {
        ...slotItem,
        isSlotted: slotItems[slotItemId]?.isSlotted || false,
      },
    }));
  };

  const setSlotItemIsSlottedById = (slotItemId, isSlotted) => {
    console.log("slotItemRegistry: Setting isSlotted", slotItemId, isSlotted);
    setSlotItems((slotItems) => ({
      ...slotItems,
      [slotItemId]: { ...slotItems[slotItemId], isSlotted: isSlotted },
    }));
  };

  return (
    <SlotItemContext.Provider
      value={{
        slotItems,
        setSlotItemById,
        setSlotItemIsSlottedById,
      }}
    >
      {children}
    </SlotItemContext.Provider>
  );
};

export const useSlotItemRegistry = () => {
  const { slotItems, setSlotItemById, setSlotItemIsSlottedById } =
    useContext(SlotItemContext);
  return [slotItems, setSlotItemById, setSlotItemIsSlottedById];
};
