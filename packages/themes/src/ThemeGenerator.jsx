import { useState, useEffect } from "react";

//ui components
import { Card } from "@repo/utils/Card";
import { Dialog, DialogButton } from "@repo/utils/DialogButton";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@repo/utils/Dialog";

import { ColourControls } from "./ColourControls";
import { ColourConverter } from "./ColourConverter";

import { hslToHex } from "../functions/colorUtils";
import { hslToObject } from "../functions/colorUtils";

import { useTheme } from "@repo/themes/ThemeProvider";
import { ThemeSelector } from "@repo/themes/ThemeSelector";
import { ThemePanel } from "./ThemePanel";

import { CopyTheme } from "./CopyTheme";

//styling data
import Themes from "./themes.json";
import style_metadata from "./style_metadata.json";

export function ThemeGenerator() {
  const { theme, theme_options } = useTheme();

  console.log(theme);
  var initial_colours = get_theme_values(Themes[theme]);
  console.log(initial_colours);

  //var colours = initial_colours;
  const [colours, setColours] = useState(initial_colours);
  const [activeColor, setActiveColor] = useState(null);
  const [includeAlpha, setIncludeAlpha] = useState(false);

  // useEffect(() => {
  //   initial_colours = get_inital_colours();
  //   setColours(initial_colours);
  // }, [theme]);

  var main_styles = {};
  for (const [key, value] of Object.entries(style_metadata)) {
    if (value["group"] === "main") {
      main_styles[key] = {};
      main_styles[key] = initial_colours[key];
      main_styles[key]["description"] = value["description"];
    } else {
      continue;
    }
  }
  console.log(main_styles);

  const isValidColor = (config) => {
    return (
      !isNaN(config.hue) &&
      !isNaN(config.saturation) &&
      !isNaN(config.lightness) &&
      !isNaN(config.alpha ?? 1)
    );
  };

  const updateCSSVariable = (name, setting) => {
    const style = document.documentElement.style;

    const alpha = setting.alpha ?? 1;
    const value = `${setting.hue} ${setting.saturation}% ${setting.lightness}%${
      includeAlpha && alpha < 1 ? ` / ${alpha * 100}%` : ""
    }`;
    style.setProperty(`--${name}`, value);
    console.log("setting:", `--${name}`, value);
  };

  const updateColor = (colorName, property, value) => {
    setColours((prev) => {
      const newColors = {
        ...prev,
        [colorName]: { ...prev[colorName], [property]: value },
      };
      updateCSSVariable(colorName, newColors[colorName]);
      return newColors;
    });
  };

  function get_theme_values() {
    console.log("get_theme_values");
    var initial_colours = {};

    for (const [key, value] of Object.entries(Themes[theme])) {
      initial_colours[key] = hslToObject(value);
    }

    return initial_colours;
  }

  function get_inital_colours() {
    console.log("get_inital_colours");
    var initial_colours = {};
    var style = getComputedStyle(document.body);

    for (const [key, value] of Object.entries(style_metadata)) {
      var hsl_value = style.getPropertyValue("--" + key);
      initial_colours[key] = hslToObject("hsl(" + hsl_value + ")");
    }

    return initial_colours;
  }

  var ThemePanels = theme_options.map((theme) => {
    return (
      <ThemePanel key={theme} name={theme} styles={Themes[theme]}></ThemePanel>
    );
  });

  return (
    <div>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <ThemeSelector></ThemeSelector>
            {ThemePanels}
            <CopyTheme currentTheme={theme} colours={colours}></CopyTheme>

            <ColourConverter />
          </div>
          <h1>Theme Selected:{theme}</h1>

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

      {/* Dialogs */}

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

      {/* <Dialog
        open={activeColor !== null}
        onOpenChange={(open) => !open && setActiveColor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{activeColor}</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
