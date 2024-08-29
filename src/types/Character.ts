export interface SpellSlot {
  slot_id: string;
  slot_level: number;
}

export interface Character {
  basic_info: {
    name: string;
    class: string;
    level: number;
  };
  derived: {
    ability_modifiers: {
      strength_modifier: number;
    };
  };
  armor_class: number;
  spellcasting: {
    spell_save_dc: number;
    spell_slots: Record<string, SpellSlot>;
  };
}
