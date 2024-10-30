import { useLocation } from "react-router-dom";

//MONOREPO PACKAGE IMPORTS
import { useGetRequest } from "@repo/hooks/useGetRequest";

import { Button } from "@repo/utils/Button";
import { setTitleText } from "@repo/utils/setTitleText";
import { Capitalize } from "@repo/utils/StringFunctions";
import { EditModelForm } from "@repo/forms/EditModelForm";
import { DialogButton } from "@repo/utils/DialogButton";

//LOCAL COMPONENTS
import Metadata from "./Metadata";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

//component data
import HealthModelData from "./metadata/HealthModelData.json";

export default function Health() {
  var object_name = "Health";
  const { state } = useLocation();
  const object_id = state?.object_id;

  const get_api_url = "/fastapi/health/get_by_id" + "/" + object_id;
  const getResponse = useGetRequest(get_api_url);

  if (getResponse.isSuccess) {
    var metadata = getResponse.data.metadata;
    var breadcrumb = getResponse.data.breadcrumb;

    setTitleText(object_name + ":" + Capitalize(metadata.name));
  }

  return (
    <div>
      {getResponse.isSuccess && (
        <div>
          <NavigationBreadcrumb data={breadcrumb} />
          <div>
            <DialogButton key={"dialog-" + metadata.id}>
              <DialogButton.Button asChild>
                <Button variant="blue">Edit {object_name}</Button>
              </DialogButton.Button>

              <DialogButton.Content title="Edit Entry" variant="grey">
                <EditModelForm
                  key={"entryform_edit_data_entry"}
                  ModelData={HealthModelData}
                  query_invalidation={[get_api_url]}
                  obj_data={metadata}
                />
              </DialogButton.Content>
            </DialogButton>
          </div>
          <div className="grid xl:grid-cols-12">
            <div className="col-span-6">
              <Metadata
                ModelData={HealthModelData.model_attributes}
                metadata={metadata}
                children_attributes={[]}
                parent_name=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
