import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

//other modules
import dayjs from "dayjs";

import { KeyValueTable } from "@repo/datatable/KeyValueTable";

export default function MetadataAccordion({
  ModelData,
  metadata,
  children_names,
  parent_name,
}) {
  var key_value_pairs = [];

  ModelData.map(function (item, index, array) {
    var name = item["name"];
    var value = metadata[name];

    switch (item["type"]) {
      case "datetime":
        value = dayjs(value).format("MMM, D YYYY - h:mma");
        break;
      case "boolean":
        value = <p className="text-green-400">{value.toString()}</p>;
        break;
      default:
        break;
    }
    key_value_pairs.push({ key: name, value: value });
  });

  var main_attributes = JSON.parse(JSON.stringify(metadata));
  console.log(key_value_pairs);

  const child_elements = children_names.map((child) => {
    delete main_attributes[child];
    console.log(main_attributes);

    return (
      <Disclosure key={"child-" + child} as="div" className="p-1">
        <DisclosureButton className="py-2">{child}</DisclosureButton>
        <DisclosurePanel className="text-gray-500">
          <pre style={{ fontSize: "10px" }}>
            <code>{JSON.stringify(metadata[child], null, 2)}</code>
          </pre>
        </DisclosurePanel>
      </Disclosure>
    );
  });

  // var key_value_pairs = [];

  // for (const [key, value] of Object.entries(main_attributes)) {
  //   key_value_pairs.push({ key: key, value: value });
  // }

  //console.log(key_value_pairs);

  // delete main_attributes[children_names];
  // delete main_attributes[parent_name];

  return (
    <div>
      {child_elements}

      <Disclosure as="div" className="p-1">
        <DisclosureButton className="py-2">Main Attributes</DisclosureButton>
        <DisclosurePanel className="text-gray-500">
          <KeyValueTable table_data={key_value_pairs}></KeyValueTable>

          {/* {Object.entries(main_attributes).map(([key, value]) => (
            <p key={key}>
              <b>{key}</b> : {metadata[key]}
            </p>
          ))} */}
        </DisclosurePanel>
      </Disclosure>

      {/* <Disclosure as="div" className="p-1">
        <DisclosureButton className="py-2">{children_name}</DisclosureButton>
        <DisclosurePanel className="text-gray-500">
          <pre style={{ fontSize: "10px" }}>
            <code>{JSON.stringify(metadata[children_name], null, 2)}</code>
          </pre>
        </DisclosurePanel>
      </Disclosure> */}

      <Disclosure as="div" className="p-1">
        <DisclosureButton className="py-2">{parent_name}</DisclosureButton>
        <DisclosurePanel className="text-gray-500">
          <pre style={{ fontSize: "10px" }}>
            <code>{JSON.stringify(metadata[parent_name], null, 2)}</code>
          </pre>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
