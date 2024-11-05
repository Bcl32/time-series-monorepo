import React from "react";
//context
import { FilterContext } from "./FilterContext";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

//mui
import EditIcon from "@mui/icons-material/Edit";

import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

//MONOREPO PACKAGE IMPORTS
import { Button } from "@repo/utils/Button";
import { DialogButton } from "@repo/utils/DialogButton";

//local imports
import TimeEditDialog from "./TimeEditDialog";

export function TimeFilter({ name, ...props }) {
  var { filters, change_filters } = React.useContext(FilterContext);

  function change_time_filter(name, timespan, value) {
    var timespans = JSON.parse(JSON.stringify(filters[name]["value"])); //get current values
    timespans[timespan] = value; //update the value for the selected timespan (begin or end)
    change_filters(name, "value", timespans);
  }

  function reset_value() {
    change_filters(name, "value", filters[name]["filter_empty"]);
  }

  return (
    <div>
      <h1 className="font-semibold text-xl pr-2">
        {" "}
        {name[0].toUpperCase() + name.slice(1)}:
      </h1>

      <div className="grid xl:grid-cols-3">
        <div>
          <h1>Start Time</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              value={dayjs(filters[name]["value"]["timespan_begin"])}
              onChange={(newValue) =>
                change_time_filter(name, "timespan_begin", newValue)
              }
            />
          </LocalizationProvider>
        </div>

        <div>
          <h1>End Time</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              value={dayjs(filters[name]["value"]["timespan_end"])}
              onChange={(newValue) =>
                change_time_filter(name, "timespan_end", newValue)
              }
            />
          </LocalizationProvider>
        </div>

        <div>
          <DialogButton key={"dialog-time-edit" + name}>
            <DialogButton.Button asChild>
              <Button variant="default" size="default">
                <EditIcon /> Edit Shortcuts
              </Button>
            </DialogButton.Button>

            <DialogButton.Content
              title={"Change datetime for " + name}
              variant="grey"
              size="big"
            >
              <TimeEditDialog
                filters={filters}
                change_time_filter={change_time_filter}
                change_filters={change_filters}
                name={name}
              ></TimeEditDialog>
            </DialogButton.Content>
          </DialogButton>

          <Button onClick={reset_value} variant="blue" size="lg">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
