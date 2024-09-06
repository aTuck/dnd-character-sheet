import React from "react";
import { Character } from "../types/Character";

const PlayerSetting: React.FC<{ character: Character }> = ({ character }) => {
  return (
    <>
      {character && (
        <div>
          <h1>{character.basic_info.name}</h1>
          <p>Class: {character.basic_info.class}</p>
          <p>Level: {character.basic_info.level}</p>
          <p>
            Strength Modifier:{" "}
            {character.derived.ability_modifiers.strength_modifier}
          </p>
          <p>Armor Class: {character.armor_class}</p>
          <p>Spell Save DC: {character.spellcasting.spell_save_dc}</p>
        </div>
      )}
    </>
  );
};

export default PlayerSetting;
