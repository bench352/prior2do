import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import KeyIcon from "@mui/icons-material/Key";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {useState} from "react";
import ConfirmDialog from "../../../Components/dialog/misc/ConfirmDialog";
import SingleTextInputDialog from "../../../Components/dialog/misc/SingleTextInputDialog";
import {AccountsController} from "../../../../Controller/Accounts";

interface LoggedInProps {
    setLoginStateFunc(isLoggedIn: boolean): any;
}

const accountsCon = new AccountsController();

export default function LoggedIn(props: LoggedInProps) {
    const [confirmDeleteDialogShow, setConfirmDeleteDialogShow] = useState(false);
    const [changePasswordDialogShow, setChangePasswordDialogShow] =
        useState(false);
    const confirmedDeleteAccount = async () => {
        await accountsCon.deleteAccount();
        props.setLoginStateFunc(false);
    };
    const handleConfirmDeleteClose = () => {
        setConfirmDeleteDialogShow(false);
    };
    const handleChangePasswordShow = () => {
        setChangePasswordDialogShow(false);
    };
    const handleNewPasswordValue = (newPassword: string) => {
        accountsCon.updatePassword(newPassword);
    };
    return (
        <div>
            <Card>
                <CardHeader
                    avatar={<Avatar></Avatar>}
                    title={accountsCon.getUsername()}
                    subheader="What's in your mind?"
                />
            </Card>
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setChangePasswordDialogShow(true);
                        }}
                    >
                        <ListItemIcon>
                            <KeyIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Update Your Password"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            setConfirmDeleteDialogShow(true);
                        }}
                    >
                        <ListItemIcon>
                            <DeleteOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Delete Your Account"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            accountsCon.logout();
                            props.setLoginStateFunc(false);
                        }}
                    >
                        <ListItemIcon>
                            <LogoutOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <ConfirmDialog
                open={confirmDeleteDialogShow}
                confirmAction={confirmedDeleteAccount}
                title="Confirm Delete Account?"
                message="All your account data on the Prior2Do Sync server will be deleted and cannot be recovered. Data stored locally on your device would still remain. Do you confirm doing so?"
                handleClose={handleConfirmDeleteClose}
            />
            <SingleTextInputDialog
                open={changePasswordDialogShow}
                setConfirmValue={handleNewPasswordValue}
                title="Update Your Password"
                message="Enter a new password for your account."
                handleClose={handleChangePasswordShow}
                type="password"
            />
        </div>
    );
}
