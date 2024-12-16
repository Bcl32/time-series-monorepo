import React from "react";
import { ClaimsDisplay } from "./auth/ClaimsDisplay";
import { SignInButton } from "./auth/SignInButton";
import { SignOutButton } from "./auth/SignOutButton";
import {
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
function Claims() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <>
      {activeAccount ? <SignOutButton /> : <SignInButton />}
      <AuthenticatedTemplate>
        {activeAccount ? (
          <ClaimsDisplay idTokenClaims={activeAccount.idTokenClaims} />
        ) : null}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <p>Please sign in!</p>
      </UnauthenticatedTemplate>
    </>
  );
}

export default Claims;
