//THIRD PARTY LIBRARIES
import React, { useState, useEffect, useRef, useMemo } from "react";
//datetime modules
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

//my package imports
import { useDatabaseMutation } from "@repo/hooks/useDatabaseMutation";

//my custom components
import { FormElement } from "./FormElement";

export function AddModelForm(props) {
  var ModelData = props.ModelData;

  var form_defaults = {};
  ModelData.model_attributes.forEach((item) => {
    form_defaults[item.name] = item.default;
  });

  const [formData, setFormData] = React.useState(form_defaults);

  //used to update formData
  function handleChange(event) {
    console.log(event);
    var { name, value, type, checked } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  //special formData updater function for datetime as event.target doesn't work with datetimepicker
  function change_datetime(value, name) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });

    document.getElementById("input_" + name).innerText = value.format(
      "MMM, D YYYY - h:mma"
    ); //changes label on datetimepicker to reflect new updated form value
  }

  async function add_new_entry() {
    props.processing_function?.(); //runs if exists
    let response = await mutation_add_entry.mutate();
  }

  const mutation_add_entry = useDatabaseMutation(
    props.add_api_url,
    { payload: formData },
    props.query_invalidation
  );

  return (
    <div>
      <form>
        {ModelData.model_attributes.map((entry) => {
          if (entry["editable"]) {
            return (
              <FormElement
                key={entry.name}
                entry_data={entry}
                handleChange={handleChange}
                change_datetime={change_datetime}
                formData={formData}
                setFormData={setFormData}
              />
            );
          } else {
            return null;
          }
        })}
      </form>

      <button
        onClick={add_new_entry}
        className="w-32 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Create New
      </button>

      {mutation_add_entry.isLoading && "Adding entry..."}
      {mutation_add_entry.isError && (
        <div style={{ color: "red" }}>
          An error occurred: {mutation_add_entry.error.message}
        </div>
      )}
      {mutation_add_entry.isSuccess && (
        <div style={{ color: "green" }}>Entry Added!</div>
      )}
    </div>
  );
}
