import React from "react";
import "./UVIndex.css";
import { getStatusUV } from "../utils/statusUtils";

const UVIndex = ({ value, status }) => {
  const uvLevel = getStatusUV(value).toLowerCase().split(" ")[0]; // Extrahiere den UV-Level
  console.log(value);
  console.log(uvLevel);

  const maxAngle = 180; // Halbkreis geht bis 180 Grad
  const angle = (value / 17) * maxAngle; // UV-Index bestimmt Füllwinkel

  return (
    <div className="uv-container">
        <div className="half-mask-container">
            <div
                className="circle1"
                style={{ 
                    WebkitMaskImage: `conic-gradient(from -90deg,rgb(245, 55, 255) 0deg, rgb(242, 0, 255) ${angle}deg, rgba(251, 0, 255, 0) ${angle}deg, rgb(255, 0, 234) 180deg)`,
                    maskImage: `conic-gradient(from -90deg,rgb(75, 55, 255) 0deg, rgb(0, 30, 255) ${angle}deg, rgba(0, 38, 255, 0) ${angle}deg, rgb(0, 64, 255) 180deg)`
                }}
            >
                <div className="circle2">
                </div>
            </div>
        <div className="uv-value">{value}</div>
                
    </div>
    </div>
  );
};

export default UVIndex;
