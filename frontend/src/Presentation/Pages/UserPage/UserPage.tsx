import Container from "@mui/material/Container";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useState} from "react";
import {AccountsController} from "../../../Controller/Accounts";
import {SettingsController} from "../../../Controller/Settings";
import LoggedIn from "./Views/LoggedIn";
import NotLoggedIn from "./Views/NotLoggedIn";
import SyncNotEnabled from "./Views/SyncNotEnabled";

const accountsCon = new AccountsController();
const settingsCon = new SettingsController();

export default function UserPage() {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
    const [loginState, setLoginState] = useState(accountsCon.isLoggedIn());
    if (settingsCon.getIsSyncEnabled()) {
        return (
            <Container disableGutters={isMobileScreenSize}>
                {loginState ? (
                    <LoggedIn setLoginStateFunc={setLoginState}/>
                ) : ( // TODO Fix login function based on new implementation
                    <NotLoggedIn setLoginStateFunc={setLoginState}/>
                )}
            </Container>
        );
    } else {
        return (
            <Container>
                <SyncNotEnabled/>
            </Container>
        );
    }
}
