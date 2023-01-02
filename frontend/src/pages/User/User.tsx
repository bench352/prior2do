import NotLoggedIn from "./NotLoggedIn";
import { isLoggedIn } from "../../components/storage/Accounts";
import { useState } from "react";
import LoggedIn from "./LoggedIn";

export default function User() {
  const [loginState, setLoginState] = useState(isLoggedIn());

  return (
    <div>
      {loginState ? (
        <LoggedIn setLoginStateFunc={setLoginState} />
      ) : (
        <NotLoggedIn setLoginStateFunc={setLoginState} />
      )}
    </div>
  );
}
