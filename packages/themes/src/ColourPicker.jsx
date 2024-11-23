import { useState, useEffect, useRef } from "react";
import { cn } from "@repo/utils/cn";
import { Input } from "@repo/utils/Input";

export function ColourPicker({ color, onChange, className }) {
  // Strip alpha channel if present for display
  const displayColor = color.length === 9 ? color.slice(0, 7) : color;
  const [inputColor, setInputColor] = useState(displayColor);
  const [isValidColor, setIsValidColor] = useState(true);
  const colorInputRef = useRef(null);

  useEffect(() => {
    const newDisplayColor = color.length === 9 ? color.slice(0, 7) : color;
    setInputColor(newDisplayColor);
  }, [color]);

  const handleColorChange = (newColor) => {
    setInputColor(newColor);
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setIsValidColor(true);
      // Preserve alpha from original color if it exists
      const alpha = color.length === 9 ? color.slice(7) : "ff";
      onChange(newColor + alpha);
    } else {
      setIsValidColor(false);
    }
  };

  const openColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        onClick={openColorPicker}
        style={{
          backgroundColor: displayColor,
          opacity: color.length === 9 ? parseInt(color.slice(7), 16) / 255 : 1,
        }}
        className="h-10 w-10 cursor-pointer rounded border border-input"
        aria-label="Select color"
      />
      <Input
        type="color"
        value={displayColor}
        ref={colorInputRef}
        onChange={(e) => handleColorChange(e.target.value)}
        className="hidden"
      />
      <Input
        type="text"
        value={inputColor}
        onChange={(e) => handleColorChange(e.target.value)}
        className={cn(
          "h-10 w-28 rounded-md border px-3 py-2 text-sm bg-white text-black",
          isValidColor ? "border-input" : "border-red-500"
        )}
        placeholder="#FFFFFF"
        aria-label="Enter hex color"
      />
    </div>
  );
}
