const characterLoader = (() => {
  function calculateModifier(ability) {
    return Math.floor((ability - 10) / 2);
  }

  function calculateProficiencyBonus(level) {
    return Math.floor((level + 7) / 4);
  }

  function calculateSavingThrow(
    abilityModifier,
    proficiencyBonus,
    isProficient
  ) {
    return abilityModifier + (isProficient ? proficiencyBonus : 0);
  }

  function calculateSpellSaveDC(proficiencyBonus, abilityModifier) {
    return 8 + proficiencyBonus + abilityModifier;
  }

  function evaluateCharacterConfig(character) {
    const evaluated = { ...character };
    console.log(evaluated);
    // Calculate ability modifiers
    evaluated.derived = {
      ability_modifiers: {
        strength_modifier: calculateModifier(evaluated.abilities.strength),
        dexterity_modifier: calculateModifier(evaluated.abilities.dexterity),
        constitution_modifier: calculateModifier(
          evaluated.abilities.constitution
        ),
        intelligence_modifier: calculateModifier(
          evaluated.abilities.intelligence
        ),
        wisdom_modifier: calculateModifier(evaluated.abilities.wisdom),
        charisma_modifier: calculateModifier(evaluated.abilities.charisma),
      },
      proficiency_bonus: calculateProficiencyBonus(evaluated.basic_info.level),
      saving_throws: {},
      skills: {},
    };

    // Calculate saving throws
    const savingThrowProficiencies = {
      strength:
        evaluated.class_features?.saving_throw_proficiency?.includes(
          "strength"
        ),
      dexterity:
        evaluated.class_features?.saving_throw_proficiency?.includes(
          "dexterity"
        ),
      constitution:
        evaluated.class_features?.saving_throw_proficiency?.includes(
          "constitution"
        ),
      intelligence:
        evaluated.class_features?.saving_throw_proficiency?.includes(
          "intelligence"
        ),
      wisdom:
        evaluated.class_features?.saving_throw_proficiency?.includes("wisdom"),
      charisma:
        evaluated.class_features?.saving_throw_proficiency?.includes(
          "charisma"
        ),
    };

    Object.keys(savingThrowProficiencies).forEach((key) => {
      evaluated.derived.saving_throws[key] = calculateSavingThrow(
        evaluated.derived.ability_modifiers[`${key}_modifier`],
        evaluated.derived.proficiency_bonus,
        savingThrowProficiencies[key]
      );
    });

    // Calculate skill modifiers
    Object.keys(evaluated.skills).forEach((skill) => {
      const ability = evaluated.skills[skill].ability;
      const isProficient = evaluated.proficiencies.skills.includes(skill);
      evaluated.derived.skills[skill] =
        evaluated.derived.ability_modifiers[`${ability}_modifier`] +
        (isProficient ? evaluated.derived.proficiency_bonus : 0);
    });

    // Calculate armor class (AC)
    evaluated.armor_class =
      10 +
      evaluated.derived.ability_modifiers.dexterity_modifier +
      evaluated.equipment.armor.reduce(
        (ac, armor) => ac + (armor.armor_class || 0),
        0
      );

    // Calculate initiative
    evaluated.initiative =
      evaluated.derived.ability_modifiers.dexterity_modifier;

    // Calculate spell save DC
    if (evaluated.spellcasting) {
      evaluated.spellcasting.spell_save_dc = calculateSpellSaveDC(
        evaluated.derived.proficiency_bonus,
        evaluated.derived.ability_modifiers[
          `${evaluated.spellcasting.spellcasting_ability.toLowerCase()}_modifier`
        ]
      );

      evaluated.spellcasting.spell_attack_bonus =
        evaluated.derived.proficiency_bonus +
        evaluated.derived.ability_modifiers[
          `${evaluated.spellcasting.spellcasting_ability.toLowerCase()}_modifier`
        ];
    }

    // Calculate hit points (HP)
    evaluated.hit_points.maximum = evaluated.hit_points.hit_dice
      .split("d")
      .map((num, i) => {
        if (i === 0)
          return (
            parseInt(num) *
            (parseInt(
              evaluated.derived.ability_modifiers.constitution_modifier
            ) +
              (parseInt(num) * (evaluated.basic_info.level - 1)) / 2)
          );
        return parseInt(num) * evaluated.basic_info.level;
      })
      .reduce((acc, curr) => acc + curr, 0);

    return evaluated;
  }

  function loadCharacter(config) {
    return evaluateCharacterConfig(config);
  }

  return {
    loadCharacter,
  };
})();

export default characterLoader;
