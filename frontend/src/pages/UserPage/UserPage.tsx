import Container from "@mui/material/Container";
import { useState } from "react";
import { isLoggedIn } from "../../components/storage/Accounts";
import { isSyncEnabled } from "../../components/storage/StorageBackend";
import LoggedIn from "./Views/LoggedIn";
import NotLoggedIn from "./Views/NotLoggedIn";
import SyncNotEnabled from "./Views/SyncNotEnabled";

export default function UserPage() {
  const [loginState, setLoginState] = useState(isLoggedIn());
  if (isSyncEnabled()) {
    return (
      <Container>
        {loginState ? (
          <LoggedIn setLoginStateFunc={setLoginState} />
        ) : (
          <NotLoggedIn setLoginStateFunc={setLoginState} />
        )}
      </Container>
    );
  } else {
    return (
      <Container>
        <SyncNotEnabled />
      </Container>
    );
  }
}
