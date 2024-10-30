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

export default function NavigationBreadcrumb({ data }) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xl">
        <BreadcrumbLink asChild>
          <Link to={"/"}>Home</Link>
        </BreadcrumbLink>

        {data.map((entry) => {
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
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {entry["type"][0].toUpperCase() +
                          entry["type"].slice(1)}
                        :
                      </span>
                      <span>
                        {entry["name"][0].toUpperCase() +
                          entry["name"].slice(1)}
                      </span>
                    </div>
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
