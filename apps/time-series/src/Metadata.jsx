import React from "react";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

//other modules
import dayjs from "dayjs";

import { KeyValueTable } from "@repo/datatable/KeyValueTable";
import { Capitalize } from "@repo/utils/StringFunctions";

export default function Metadata({
  ModelData,
  metadata,
  children_attributes,
  parent_name,
}) {
  var main_attributes = ModelData.filter((entry) => {
    return entry["source"] != "db";
  });
  var main_table_data = get_key_value_pairs(main_attributes, metadata);

  var metadata_attributes = ModelData.filter((entry) => {
    return entry["source"] == "db";
  });
  var metadata_table_data = get_key_value_pairs(metadata_attributes, metadata);

  const child_tab_titles = children_attributes.map((child) => {
    var child_name = child[0];
    return (
      <Tab
        key={"tab_title" + { child_name }}
        className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600"
      >
        {Capitalize(child_name)}
      </Tab>
    );
  });

  const child_tabs = children_attributes.map((child) => {
    var child_name = child[0];
    var child_model = child[1];
    var child_data = metadata[child_name];

    let table_data = get_key_value_pairs(child_model, child_data);

    return (
      <TabPanel key={"tab_panel" + { child_name }}>
        <KeyValueTable
          key={"table" + { child_name }}
          table_data={table_data}
        ></KeyValueTable>
      </TabPanel>
    );
  });

  return (
    <div>
      <TabGroup>
        <TabList>
          <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
            Main Attributes
          </Tab>
          <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
            Metadata
          </Tab>
          {child_tab_titles}
          <Tab className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[hover]:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 data-[selected]:text-indigo-600 data-[selected]:border-indigo-600">
            Full JSON
          </Tab>
        </TabList>
        <TabPanels className="h-96 overflow-auto">
          <TabPanel>
            <KeyValueTable table_data={main_table_data}></KeyValueTable>
          </TabPanel>
          <TabPanel>
            <KeyValueTable table_data={metadata_table_data}></KeyValueTable>
          </TabPanel>
          {child_tabs}

          <TabPanel>
            <div className="h-full">
              <pre style={{ fontSize: "10px" }}>
                <code>{JSON.stringify(metadata, null, 2)}</code>
              </pre>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}

function get_key_value_pairs(ModelData, metadata) {
  var key_value_pairs = [];
  ModelData.map(function (item, index, array) {
    var name = item["name"];
    var value = metadata[name];

    switch (item["type"]) {
      case "datetime":
        value = dayjs(value).format("MMM, D YYYY - h:mma");
        key_value_pairs.push({ key: name, value: value });
        break;
      case "boolean":
        if (value == true) {
          value = <p className="text-green-400">{value.toString()}</p>;
        } else if (value == false) {
          value = <p className="text-red-400">{value.toString()}</p>;
        }
        key_value_pairs.push({ key: name, value: value });
        break;

      case "object":
      case "children":
        // for (const key in value) {
        //   var sub_value = metadata[name][key];
        //   console.log(key, sub_value);
        //   var sub_name = name + ": " + key;
        //   key_value_pairs.push({ key: sub_name, value: sub_value });
        // }
        break;
      default:
        key_value_pairs.push({ key: name, value: value });
        break;
    }
  });
  return key_value_pairs;
}
