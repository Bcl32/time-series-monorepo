import React from "react";

export function UserIcon({ name }) {
  const nameParts = name.split(" ");
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
  const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

  return (
    <span className="flex justify-center items-center text-[12px] bg-primary text-primary-foreground rounded-full mt-[1px] mr-[5px] px-2 py-1">
      {firstNameInitial}
      {lastNameInitial}
    </span>
  );
}
