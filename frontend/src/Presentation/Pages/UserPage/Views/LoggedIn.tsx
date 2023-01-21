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
import { useState } from "react";
import {
  deleteAccount,
  getUsername,
  logout,
  updatePassword,
} from "../../../../components/storage/Accounts";
import ConfirmDialog from "../../../UserInterface/dialog/ConfirmDialog";
import SingleTextInputDialog from "../../../UserInterface/dialog/SingleTextInputDialog";

interface LoggedInProps {
  setLoginStateFunc(isLoggedIn: boolean): any;
}

export default function LoggedIn(props: LoggedInProps) {
  const [confirmDeleteDialogShow, setConfirmDeleteDialogShow] = useState(false);
  const [changePasswordDialogShow, setChangePasswordDialogShow] =
    useState(false);
  const confirmedDeleteAccount = async () => {
    props.setLoginStateFunc(!(await deleteAccount()));
  };
  const handleConfirmDeleteClose = () => {
    setConfirmDeleteDialogShow(false);
  };
  const handleChangePasswordShow = () => {
    setChangePasswordDialogShow(false);
  };
  const handleNewPasswordValue = (newPassword: string) => {
    updatePassword(newPassword);
  };
  return (
    <div>
      <Card>
        <CardHeader
          avatar={<Avatar></Avatar>}
          title={getUsername()}
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
              <KeyIcon />
            </ListItemIcon>
            <ListItemText primary="Update Your Password" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setConfirmDeleteDialogShow(true);
            }}
          >
            <ListItemIcon>
              <DeleteOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Delete Your Account" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              logout();
              props.setLoginStateFunc(false);
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
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
