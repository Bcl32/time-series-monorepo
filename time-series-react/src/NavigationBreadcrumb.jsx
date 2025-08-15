import { Slash } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/utils/Breadcrumb";

import { useNavigation } from "./NavigationProvider";

export default function NavigationBreadcrumb({ data }) {
  const { navigation } = useNavigation();

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xl text-foreground">
        <BreadcrumbLink asChild>
          <Link to={"/"}>Home</Link>
        </BreadcrumbLink>

        {navigation?.map((entry) => {
          return (
            <div
              className={"inline-flex items-center gap-1.5"}
              key={"breadcrumb" + entry["type"]}
            >
              <BreadcrumbSeparator className="[&>svg]:size-4.5">
                <Slash />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={"/" + entry["type"]}
                    state={{ object_id: entry["id"] }}
                  >
                    <LinkLabel entry={entry}></LinkLabel>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function LinkLabel({ entry }) {
  if (entry.hasOwnProperty("type")) {
    return (
      <div className="flex flex-col">
        <span className="text-xs capitalize">{entry["type"]}:</span>
        <span className="capitalize">{entry["name"]}</span>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <span className="capitalize">{entry["name"]}</span>
      </div>
    );
  }
}
