import { useState } from "react";
import { Copy } from "lucide-react";
import { DialogButton } from "@repo/utils/DialogButton";
import { Button } from "@repo/utils/Button";
import { ToggleGroup, ToggleGroupItem } from "@repo/utils/ToggleGroup";

export function CopyTheme({ currentTheme, colours }) {
  const [format, setFormat] = useState("json");

  const generateThemeCSS = () => {
    if (format === "css") {
      const formatColor = ({ hue, saturation, lightness, alpha }) => {
        return `${hue} ${saturation}% ${lightness}%`;
      };

      const Variables = Object.entries(colours)
        .map(([name, config]) => `  --${name}: ${formatColor(config)};`)
        .join("\n");

      return `:root {\n${Variables}\n}`;
    }

    if (format === "json") {
      const formatColor = ({ hue, saturation, lightness, alpha }) => {
        return `"hsl(${hue} ${saturation}% ${lightness}%)"`;
      };

      const Variables = Object.entries(colours)
        .map(([name, config]) => `"${name}": ${formatColor(config)},`)
        .join("\n");

      return `"${currentTheme}": {\n${Variables}\n}`;
    }
  };

  function copyTheme() {
    navigator.clipboard.writeText(generateThemeCSS());
    alert("Theme CSS copied to clipboard!");
  }

  return (
    <DialogButton key={"dialog-copy-theme"}>
      <DialogButton.Button asChild>
        <Button variant="outline">
          <Copy className="w-4 h-4 mr-2" /> Copy Theme
        </Button>
      </DialogButton.Button>

      <DialogButton.Content title="Copy Theme" variant="default">
        <ToggleGroup
          type="single"
          variant="outline"
          value={format}
          onValueChange={(value) => {
            setFormat(value);
          }}
        >
          <ToggleGroupItem value="json">{"json"}</ToggleGroupItem>
          <ToggleGroupItem value="css">{"css"}</ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="outline"
          onClick={copyTheme}
          className="flex items-center text-primary"
          title="Copy Theme"
        >
          <Copy className="w-4 h-4 mr-2" /> <span>Copy Theme</span>
        </Button>
      </DialogButton.Content>
    </DialogButton>
  );
}
