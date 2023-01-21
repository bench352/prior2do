import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { isLoggedIn } from "../../../components/storage/Accounts";
import { isSyncEnabled } from "../../../components/storage/StorageBackend";
import LoggedIn from "./Views/LoggedIn";
import NotLoggedIn from "./Views/NotLoggedIn";
import SyncNotEnabled from "./Views/SyncNotEnabled";

export default function UserPage() {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [loginState, setLoginState] = useState(isLoggedIn());
  if (isSyncEnabled()) {
    return (
      <Container disableGutters={isMobileScreenSize}>
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
