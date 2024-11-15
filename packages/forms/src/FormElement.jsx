import React from "react";

//datetime modules
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

import { Input } from "@repo/utils/Input";
import { Label } from "@repo/utils/Label";
import { Checkbox } from "@repo/utils/Checkbox";

// mui x
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import ButtonDatePicker from "./ButtonDatePicker";

export function FormElement({
  entry_data,
  formData,
  setFormData,
  change_datetime,
}) {
  var name = entry_data.name;
  var type = entry_data.type;

  //used to update formData
  function handleChange(event) {
    var { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  //special formData updater function for select comboboxes as input differs from other inputs are objects and multiple items can used
  function handleComboboxChange(attribute, value) {
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

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  function handleCheckboxChange(value) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  switch (type) {
    case "string":
      return (
        <div className="flex">
          <div>
            <Label> {name[0].toUpperCase() + name.slice(1)}:</Label>
            <Input
              variant="default"
              size="default"
              id={"input_" + name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              type="text"
              placeholder=""
            ></Input>
          </div>
        </div>
      );
    case "number":
      return (
        <div className="flex">
          <div className="w-48">
            <Label> {name[0].toUpperCase() + name.slice(1)}:</Label>
            <Input
              variant="default"
              size="lg"
              id={"input_" + name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              type="number"
              placeholder=""
            ></Input>
          </div>
        </div>
      );

    case "boolean":
      console.log(formData[name]);
      return (
        <div className="flex items-center space-x-3 col-2">
          <Checkbox
            name={name}
            checked={formData[name]}
            onCheckedChange={(checked) => {
              handleCheckboxChange(checked);
            }}
            className="w-6 h-6 border-2"
            id={"input_" + name}
            type="checkbox"
            value={formData[name]}
          />
          <Label className="text-lg leading-none" htmlFor={"input_" + name}>
            {name[0].toUpperCase() + name.slice(1)}
          </Label>
        </div>
      );

    case "list":
      return (
        <div>
          {name}
          <Autocomplete
            freeSolo
            multiple
            options={entry_data["options"]}
            value={formData[name]}
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
        // <Autocomplete
        //         freeSolo
        //         multiple
        //         options={equipment_options}
        //         value={formData.equipment}
        //         onChange={(event, value) => handleComboboxChange("equipment",value)}
        //         renderInput={(params) => (<TextField {...params}  variant="standard" label="Equipment" placeholder="Equipment" />)}
        //     />
      );

    case "select":
      return (
        <div className="flex col-2">
          <div className="w-48">
            <label
              htmlFor={name}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {/* capitalizes the string */}
              {name[0].toUpperCase() + name.slice(1)}:
            </label>
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              id={"input_" + name}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {entry_data.options.map((entry) => (
                <option key={entry.value} value={entry.value}>
                  {entry.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    case "datetime":
      return (
        <div className="py-2">
          <label
            htmlFor={name}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {/* capitalizes the string */}
            {name[0].toUpperCase() + name.slice(1)}:
          </label>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ButtonDatePicker
              label={
                dayjs(formData[name]) == null
                  ? null
                  : dayjs(formData[name]).format("MMM, D YYYY - h:mma")
              }
              value={dayjs(formData[name])}
              onChange={(newValue) => change_datetime(newValue, name)}
              id={"input_" + name}
            />
          </LocalizationProvider>
        </div>
      );
  }
}
