import React from "react";

import { AnimatedTabs, TabContent } from "@repo/utils/AnimatedTabs";
import { DialogButton } from "@repo/utils/DialogButton";
import { Button } from "@repo/utils/Button";

import { EditModelForm } from "@repo/forms/EditModelForm";
import { ShowHeirarchy } from "@repo/utils/ShowHeirarchy";

//other modules
import dayjs from "dayjs";

import { KeyValueTable } from "@repo/datatable/KeyValueTable";
import { Capitalize } from "@repo/utils/StringFunctions";

export default function Metadata({
  model_metadata,
  object_data,
  obj_heirarchy,
  children_attributes,
  query_invalidation,
  parent_name,
}) {
  var ModelData = model_metadata.model_attributes;
  var model_name = model_metadata.model_name;

  var main_attributes = ModelData.filter((entry) => {
    return entry["source"] != "db";
  });
  var main_table_data = get_key_value_pairs(main_attributes, object_data);

  var metadata_attributes = ModelData.filter((entry) => {
    return entry["source"] == "db";
  });
  var metadata_table_data = get_key_value_pairs(
    metadata_attributes,
    object_data
  );

  const child_tab_titles = children_attributes.map((child) => {
    var child_name = child[0];
    return Capitalize(child_name);
  });

  const child_tabs = children_attributes.map((child) => {
    var child_name = child[0];
    var child_model = child[1];
    var child_data = object_data[child_name];

    let table_data = get_key_value_pairs(child_model, child_data);

    return (
      <TabContent key={"tab_panel" + { child_name }}>
        <KeyValueTable
          key={"table" + { child_name }}
          table_data={table_data}
        ></KeyValueTable>
      </TabContent>
    );
  });

  var tab_titles = ["Main Attributes", "Metadata", "Full JSON", "Parent Data"];

  tab_titles.push(child_tab_titles);
  console.log(tab_titles);

  return (
    <div>
      <h1 className="text-2xl capitalize">
        {model_metadata.model_name}: {object_data.name}{" "}
      </h1>

      <DialogButton
        key={"edit-dialog-" + object_data.id}
        button={<Button variant="shine">Edit {model_name}</Button>}
        title="Edit Entry"
      >
        <EditModelForm
          key={"entryform_edit_data_entry"}
          ModelData={model_metadata}
          query_invalidation={query_invalidation}
          obj_data={object_data}
        />
      </DialogButton>

      <AnimatedTabs tab_titles={tab_titles}>
        <div className="h-96 overflow-auto">
          <TabContent>
            <KeyValueTable table_data={main_table_data}></KeyValueTable>
          </TabContent>
          <TabContent>
            <KeyValueTable table_data={metadata_table_data}></KeyValueTable>
          </TabContent>
          <TabContent>
            <div className="h-full">
              {/* <pre style={{ fontSize: "16px" }}>
                <code>{JSON.stringify(object_data, null, 2)}</code>
              </pre> */}
              <ShowHeirarchy json_data={object_data}></ShowHeirarchy>
            </div>
          </TabContent>
          <TabContent>
            <div className="h-full">
              <pre style={{ fontSize: "16px" }}>
                <code>{JSON.stringify(obj_heirarchy, null, 2)}</code>
              </pre>

              <ShowHeirarchy json_data={obj_heirarchy}></ShowHeirarchy>
            </div>
          </TabContent>
          {child_tabs}
        </div>
      </AnimatedTabs>
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
