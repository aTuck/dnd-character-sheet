import React, { useState, useEffect } from "react";
import healingWordImage from "./data/healing-word.png";
import burningHandsImage from "./data/burning-hands.png";
import "./SpellCardFace.css";

// Define the structure of the spell data
interface SpellData {
  id: string;
  name: string;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  classes: string[];
  description: {
    text: string;
  };
  higher_levels: {
    text: string;
  };
}

const SpellCardFace: React.FC = () => {
  const [spellData, setSpellData] = useState(null as SpellData | null);
  const [spellImage, setSpellImage] = useState(undefined as string | undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: SpellData = require("./data/burning-hands.json");
        setSpellData(data);
        setSpellImage(imageMap[data.id]);
      } catch (error) {
        console.error("Error fetching spell data:", error);
      }
    };

    fetchData();
  }, []);

  const emojiToSchoolMap: { [key: string]: string } = {
    "🛡️": "Abjuration",
    "✨": "Conjuration",
    "🔮": "Divination",
    "🧠": "Enchantment",
    "💥": "Evocation",
    "🎭": "Illusion",
    "☠️": "Necromancy",
    "🔄": "Transmutation",
  };

  const schoolToEmojiMap: { [key: string]: string } = {
    Abjuration: "🛡️",
    Conjuration: "✨",
    Divination: "🔮",
    Enchantment: "🧠",
    Evocation: "💥",
    Illusion: "🎭",
    Necromancy: "☠️",
    Transmutation: "🔄",
  };

  const componentToEmojiMap: { [key: string]: string } = {
    V: "🗣️",
    S: "🖐️",
    M: "🔮",
  };

  const imageMap: { [key: string]: string } = {
    "healing-word": healingWordImage,
    "burning-hands": burningHandsImage, // Example of another spell
  };

  return (
    <>
      {spellData ? (
        <div className="spell-card">
          <img className="spell-card-img" src={spellImage} alt="" />
          <div className="spell-card-header">
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
            <div className="info-item"></div>
            <div className="info-item">
              <span role="img" aria-label="duration">
                ⌛
              </span>
              <span>{spellData.duration}</span>
            </div>
          </div>
          <div className="spell-card-body">
            <p>{spellData.description.text}</p>
          </div>
          <div className="spell-card-footer">
            <div className="spell-card-footer-components">
              {spellData.components.map((component, index) => (
                <span key={index} className="component">
                  {componentToEmojiMap[component]} {component}
                </span>
              ))}
            </div>
            <div className="spell-card-footer-name">
              <h2>{spellData.name}</h2>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading spell data...</p>
      )}
    </>
  );
};

export default SpellCardFace;
