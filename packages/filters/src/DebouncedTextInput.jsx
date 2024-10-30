import React from "react";

//MONOREPO PACKAGE IMPORTS
import { Button } from "@repo/utils/Button";
import { ToggleGroup, ToggleGroupItem } from "@repo/utils/ToggleGroup";

function DebouncedTextInput({ filters, change_filters, name, ...props }) {
  //place value in state as when leaving this when inside a tab will remove the state when coming back to the tab
  const [inputValue, setInputValue] = React.useState(filters[name]["value"]);
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  //changes original input
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  //debounce the input
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue, 500]);

  //update state with debounced value
  React.useEffect(() => {
    change_filters(name, "value", debouncedInputValue);
  }, [debouncedInputValue]);

  function reset_value() {
    change_filters(name, "value", filters[name]["filter_empty"]);
    setInputValue(""); //clears display of input
  }

  return (
    <div className="flex flex-row items-center justify-between p-1 space-x-1">
      <span className="font-semibold">
        {/* capitalizes the string */}
        {name[0].toUpperCase() + name.slice(1)}:
      </span>

      <input
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        type="text"
        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder=""
      />

      <ToggleGroup
        type="single"
        variant="outline"
        value={filters[name]["rule"]}
        onValueChange={(value) => {
          console.log(name, "rule", value);
          change_filters(name, "rule", value);
        }}
      >
        <ToggleGroupItem value="contains">{"contains"}</ToggleGroupItem>
        <ToggleGroupItem value="equals">{"equals"}</ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={reset_value} variant="blue" size="lg">
        Reset
      </Button>
    </div>
  );
}

export default DebouncedTextInput;
