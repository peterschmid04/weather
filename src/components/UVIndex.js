// UVIndex.js
import React from "react";
import "./UVIndex.css";
import { getStatusUV } from "../utils/statusUtils";

const UVIndex = ({ value, status }) => {
  const uvLevel = getStatusUV(value).toLowerCase().split(" ")[0]; // Extrahiere den UV-Level
  console.log(value); // Zeigt den aktuellen UV-Wert in der Konsole
  console.log(uvLevel); // Zeigt den UV-Level (z. B. "low", "high") in der Konsole

  const maxAngle = 180; // Maximaler Winkel für den Halbkreis
  const angle = (value / 17) * maxAngle; // Berechnet den Winkel basierend auf dem UV-Index (max. UV-Index = 17)

  return (
    <div className="uv-container">
      <div className="half-mask-container">
        <div
          className="circle1"
          style={{
            mask: `conic-gradient(from -90deg, #ffee37 0deg, #ff8c00 ${angle * 0.5}deg, #b40101 ${angle}deg, transparent ${angle}deg)`,
          }}
        >
          <div className="circle2"></div>
        </div>
        <div className="uv-value">{value}</div>
      </div>
    </div>
  );
};

export default UVIndex;