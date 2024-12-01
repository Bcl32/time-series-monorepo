import { useState, useEffect } from "react";

//ui components
import { Card } from "@repo/utils/Card";
import { Dialog } from "@repo/utils/DialogButton";

import { ColourControls } from "./ColourControls";

import { hslToHex } from "../functions/colorUtils";

export function ThemeGenerator({ colours, setColours, main_styles }) {
  const [activeColor, setActiveColor] = useState(null);
  const [includeAlpha, setIncludeAlpha] = useState(false);

  const isValidColor = (config) => {
    return (
      !isNaN(config.hue) &&
      !isNaN(config.saturation) &&
      !isNaN(config.lightness) &&
      !isNaN(config.alpha ?? 1)
    );
  };

  const updateCSSVariables = (themeColors) => {
    const style = document.documentElement.style;

    Object.entries(themeColors).forEach(([name, setting]) => {
      const alpha = setting.alpha ?? 1;
      const value = `${setting.hue} ${setting.saturation}% ${setting.lightness}%${
        includeAlpha && alpha < 1 ? ` / ${alpha * 100}%` : ""
      }`;
      style.setProperty(`--${name}`, value);
    });
  };

  const updateColor = (colorName, property, value) => {
    setColours((prev) => {
      const newColors = {
        ...prev,
        [colorName]: { ...prev[colorName], [property]: value },
      };
      updateCSSVariables(newColors);
      return newColors;
    });
  };

  return (
    <div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {/* Color Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(main_styles).map(([name, config]) => {
              const validColor = isValidColor(config);
              const alpha = config.alpha ?? 1;
              const backgroundColor = validColor
                ? `hsl(${config.hue}, ${config.saturation}%, ${
                    config.lightness
                  }%${includeAlpha && alpha < 1 ? ` / ${alpha * 100}%` : ""})`
                : "transparent";

              const hexValue = validColor
                ? hslToHex(
                    config.hue,
                    config.saturation,
                    config.lightness,
                    alpha
                  )
                : "N/A";

              // Determine text color based on background lightness
              const textColor =
                config.lightness > 50 ? "text-black" : "text-white";

              return (
                <Card
                  key={name}
                  className={`
          p-4 
          flex 
          flex-col 
          items-center 
          justify-center 
          ${textColor}
          transition 
          duration-500 
          ease-in-out
          hover:scale-105 
          hover:shadow-xl 
          cursor-pointer
          active:scale-95
        `}
                  style={{ backgroundColor }}
                  onClick={() => setActiveColor(name)}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs font-bold">{hexValue}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Color Control Dialog */}
      <Dialog
        open={activeColor !== null}
        onOpenChange={(open) => !open && setActiveColor(null)}
        isModal={true}
        title={activeColor}
      >
        {activeColor && (
          <div>
            <span>{colours[activeColor]["description"]}</span>

            <ColourControls
              color={{
                ...colours[activeColor],
                alpha: colours[activeColor].alpha ?? 1,
              }}
              onChange={(property, value) =>
                updateColor(activeColor, property, value)
              }
              onHexChange={() => {}}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
