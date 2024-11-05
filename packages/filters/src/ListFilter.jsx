import React from "react";
//context
import { FilterContext } from "./FilterContext";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

//MONOREPO PACKAGE IMPORTS
import { ToggleGroup, ToggleGroupItem } from "@repo/utils/ToggleGroup";

export function ListFilter({ name, options, ...props }) {
  var { filters, change_filters } = React.useContext(FilterContext);
  //special formData updater function for select comboboxes as input differs from other inputs are objects and multiple items can used
  function handleComboboxChange(name, value) {
    var entries = [];
    value.forEach(function (item) {
      //get labels from each selected object in array
      if (typeof item.label == "undefined") {
        //custom entries don't have label key
        entries.push(item);
      } else {
        entries.push(item.label);
      } //entries from combobox are in an object with label key
    });

    change_filters(name, "value", entries);
  }

  return (
    <div>
      <span className="font-semibold">
        {/* capitalizes the string */}
        {name[0].toUpperCase() + name.slice(1)}:
      </span>

      <Autocomplete
        freeSolo
        multiple
        options={options}
        value={filters[name]["value"]}
        onChange={(event, value) => handleComboboxChange(name, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={name}
            placeholder="test"
          />
        )}
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
        <ToggleGroupItem value="any">{"any"}</ToggleGroupItem>
        <ToggleGroupItem value="all">{"all"}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
