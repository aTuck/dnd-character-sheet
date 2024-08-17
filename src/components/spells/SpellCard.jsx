import React, { useState, useEffect } from "react";
import healingword from "./data/healing-word.png";

const Spell = () => {
  const [spellData, setSpellData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = require("./data/healing-word.json");
        setSpellData(data);
      } catch (error) {
        console.error("Error fetching spell data:", error);
      }
    };

    fetchData();
  }, []);

  const emojiToSchoolMap = {
    "🛡️": "Abjuration",
    "✨": "Conjuration",
    "🔮": "Divination",
    "🧠": "Enchantment",
    "💥": "Evocation",
    "🎭": "Illusion",
    "☠️": "Necromancy",
    "🔄": "Transmutation",
  };

  const schoolToEmojiMap = {
    Abjuration: "🛡️",
    Conjuration: "✨",
    Divination: "🔮",
    Enchantment: "🧠",
    Evocation: "💥",
    Illusion: "🎭",
    Necromancy: "☠️",
    Transmutation: "🔄",
  };

  return (
    <div>
      {spellData ? (
        <div className="spell-card">
          <div className="spell-info">
            <span>Spell School</span>
            <div className="spell-info-school">
              {Object.values(schoolToEmojiMap).map((school) => (
                <span
                  key={school}
                  title={emojiToSchoolMap[school]}
                  style={{
                    fontSize:
                      school === schoolToEmojiMap[spellData.school]
                        ? "2em"
                        : "1em",
                  }}
                >
                  {school}
                </span>
              ))}
            </div>
            <div className="info-item">
              <span role="img" aria-label="casting time">
                ⏱️
              </span>
              <span>{spellData.casting_time}</span>
            </div>
            <div className="info-item">
              <span role="img" aria-label="range">
                📏
              </span>
              <span>{spellData.range}</span>
            </div>
            <div className="info-item">
              <span role="img" aria-label="components">
                🧩
              </span>
              <span>{spellData.components.join(", ")}</span>
            </div>
            <div className="info-item">
              <span role="img" aria-label="duration">
                ⌛
              </span>
              <span>{spellData.duration}</span>
            </div>
            <div className="info-item">
              <span role="img" aria-label="classes">
                🎓
              </span>
              <span>{spellData.classes.join(", ")}</span>
            </div>
          </div>
          <div className="spell-description">
            <p>{spellData.description.text}</p>
            <p>⬆️ {spellData.higher_levels.text}</p>
          </div>
          <div className="spell-card-footer-container">
            <img
              src={healingword}
              alt=""
              style={{ width: "300px", height: "2n00px" }}
            />
            <div className="spell-card-footer-text">
              <h2>{spellData.name}</h2>
              <div>Lv.</div>
              <div>{spellData.level}</div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading spell data...</p>
      )}
    </div>
  );
};

export default Spell;
