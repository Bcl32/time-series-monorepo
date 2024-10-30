import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export function SelectFilter({
  filters,
  change_filters,
  name,
  options,
  ...props
}) {
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
    </div>
  );
}
