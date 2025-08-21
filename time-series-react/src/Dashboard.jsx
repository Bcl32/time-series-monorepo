//THIRD PARTY LIBRARIES
import React from "react";

//MONOREPO PACKAGE IMPORTS

//LOCAL COMPONENTS
import { DisplaySchema } from "./DisplaySchema";
import { ShowHeirarchy } from "@repo/utils/ShowHeirarchy";
import { useNavigation } from "./NavigationProvider";

//component data
import entity_map_example from "./metadata/entity_map_example.json";

export default function Dashboard() {
  const { setNavigation } = useNavigation();

  React.useEffect(() => {
    setNavigation([]);
  }, []);

  return (
    <div>
      <DisplaySchema></DisplaySchema>
      <hr></hr>
      <ShowHeirarchy json_data={entity_map_example}></ShowHeirarchy>
      <h1>Test update hot reloading!? again?</h1>
    </div>
  );
}
