import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import {
  getUsername,
  logout,
  deleteAccount,
} from "../../components/storage/Accounts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useState } from "react";
import ConfirmDialog from "../../components/userInterface/dialog/ConfirmDialog";

interface LoggedInProps {
  setLoginStateFunc: any;
}

export default function LoggedIn(props: LoggedInProps) {
  const [confirmDeleteDialogShow, setConfirmDeleteDialogShow] = useState(false);
  const confirmedDeleteAccount = async () => {
    props.setLoginStateFunc(!(await deleteAccount()));
  };
  const handleConfirmDeleteClose = () => {
    setConfirmDeleteDialogShow(false);
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
    </div>
  );
}
