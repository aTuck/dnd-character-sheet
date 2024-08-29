import React, { createContext, useContext, useState, useEffect } from "react";
import { Character, SpellSlot } from "../types/Character";
// @ts-ignore
import characterLoader from "../statics/CharacterLoader";
import character_config from "../character_config.json";

interface CharacterContext {
  character: Character | null;
  setCharacter: (character: Character) => void;
  updateCharacterInfo: (basicInfo: Partial<Character["basic_info"]>) => void;
  updateSpellSlot: (slotId: string, spellSlot: SpellSlot) => void;
}

const CharacterContext = createContext<CharacterContext | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const character = characterLoader.loadCharacter(
      character_config
    ) as Character;

    console.log("character loader", character);
    setCharacter(character);
  }, []);

  const updateCharacterInfo = (basicInfo: Partial<Character["basic_info"]>) => {
    if (character) {
      setCharacter({
        ...character,
        basic_info: {
          ...character.basic_info,
          ...basicInfo,
        },
      });
    }
  };

  const updateSpellSlot = (slotId: string, spellSlot: SpellSlot) => {
    if (character) {
      setCharacter({
        ...character,
        spellcasting: {
          ...character.spellcasting,
          spell_slots: {
            ...character.spellcasting.spell_slots,
            [slotId]: spellSlot,
          },
        },
      });
    }
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        setCharacter,
        updateCharacterInfo,
        updateSpellSlot,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = (): CharacterContext => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return context;
};
