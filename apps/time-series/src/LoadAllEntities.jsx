import React from "react";
import { useNavigation } from "./NavigationProvider";
//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

export function LoadAllEntities({ get_api_url, name }) {
  const { setNavigation } = useNavigation();

  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var dataset = getResponse.data;
    var obj_heirarchy = [{ name: "All " + name }];
  }
  React.useEffect(() => {
    setNavigation(obj_heirarchy);
  }, [dataset]);

  return {
    dataset: dataset,
  };
}
