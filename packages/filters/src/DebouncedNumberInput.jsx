import React from "react";

//MONOREPO PACKAGE IMPORTS
import { Button } from "@repo/utils/Button";
import { ToggleGroup, ToggleGroupItem } from "@repo/utils/ToggleGroup";

function DebouncedNumberInput({ filters, change_filters, name, ...props }) {
  const [filterRule, setfilterRule] = React.useState("left");

  //place value in state as when leaving this when inside a tab will remove the state when coming back to the tab
  const [inputValue, setInputValue] = React.useState(filters[name]["value"]);
  const [debouncedInputValue, setDebouncedInputValue] = React.useState("");

  //changes original input
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // value is a string when returned, to change to number use event.target.valueAsNumber
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
        type="number"
        name={name}
        value={inputValue}
        key={"duration_select"}
        onChange={handleInputChange}
        id="hs-floating-input-email"
        className="peer p-4 block w-full border-gray-200 rounded-lg text-2xl placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2"
        placeholder="servings"
      />
      <label
        htmlFor="hs-floating-input-email"
        className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none

    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500"
      >
        {name[0].toUpperCase() + name.slice(1)}
      </label>
      <ToggleGroup
        type="single"
        variant="outline"
        value={filters[name]["rule"]}
        onValueChange={(value) => {
          console.log(name, "rule", value);
          change_filters(name, "rule", value);
        }}
      >
        <ToggleGroupItem value="<">{"<"}</ToggleGroupItem>
        <ToggleGroupItem value="=">{"="}</ToggleGroupItem>
        <ToggleGroupItem value=">">{">"}</ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={reset_value} variant="blue" size="lg">
        Reset
      </Button>
    </div>
  );
}

export default DebouncedNumberInput;
