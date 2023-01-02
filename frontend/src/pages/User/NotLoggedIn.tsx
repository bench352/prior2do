import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import { signup, login } from "../../components/storage/Accounts";
import ConfirmDialog from "../../components/userInterface/dialog/ConfirmDialog";

interface NotLoggedInProps {
  setLoginStateFunc: any;
}

export default function NotLoggedIn(props: NotLoggedInProps) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [confirmSignupDialogShow, setConfirmSignupDialogShow] = useState(false);
  const handleDialogClose = () => {
    setConfirmSignupDialogShow(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };
  const confirmSignup = async () => {
    await signup(loginForm.username, loginForm.password);
  };
  return (
    <Box>
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 12 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <h2 style={{ marginBottom: "20px" }}>
                Sign Up/Login To Your Prior2Do Account
              </h2>
              <Box
                component="form"
                autoComplete="off"
                sx={{
                  "& .MuiTextField-root": { m: 1 },
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                <TextField
                  autoFocus
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  value={loginForm.username}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="center"
                sx={{ margin: "15px 0px" }}
              >
                <Button
                  variant="contained"
                  onClick={async () => {
                    props.setLoginStateFunc(
                      await login(loginForm.username, loginForm.password)
                    );
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setConfirmSignupDialogShow(true);
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
            <CardContent>
              <h2>Utilize Prior2Do to Your Full Potential</h2>
              <p>
                Enjoy an improved task-tracking experience with Prior2Do Sync.
                Once you login to your Prior2Do Account, you can:
              </p>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <DevicesOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Access Your Tasks on Multiple Devices"
                    secondary="Never lose track of your tasks as you go. Your tasks are automatically synced (whenever your Prior2Do Sync server is accessible), so you can always keep track of them on another device."
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <BackupOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Backup Your Data"
                    secondary="Rest assured when you lose the data on your device, you can always get it back from the Prior2Do Sync Server (Provided that your server also doesn't crash, of course)."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={confirmSignupDialogShow}
        confirmAction={confirmSignup}
        title="Privacy Warning"
        message="Your data is not encrypted in the Prior2Do Sync server and the Sync server provider can view all your data in your account. Do you want to proceed with signing up?"
        handleClose={handleDialogClose}
      />
    </Box>
  );
}
