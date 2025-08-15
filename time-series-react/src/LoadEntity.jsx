import React from "react";
import { useNavigation } from "./NavigationProvider";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

export function LoadEntity({ get_api_url, child_attr_name }) {
  const { setNavigation } = useNavigation();

  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var obj_heirarchy = getResponse.data.obj_heirarchy;
    var dataset = metadata[child_attr_name];
  }
  console.log(obj_heirarchy);

  React.useEffect(() => {
    setNavigation(obj_heirarchy);
  }, [obj_heirarchy]);

  return {
    metadata: metadata,
    obj_heirarchy: obj_heirarchy,
    dataset: dataset,
  };
}
