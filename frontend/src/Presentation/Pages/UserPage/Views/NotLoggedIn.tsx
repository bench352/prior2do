import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import ConfirmDialog from "../../../Components/dialog/misc/ConfirmDialog";
import {AccountsController} from "../../../../Controller/Accounts";

interface NotLoggedInProps {
    setLoginStateFunc(isLoggedIn: boolean): any;
}

const accountsCon = new AccountsController();

export default function NotLoggedIn(props: NotLoggedInProps) {
    const [loginForm, setLoginForm] = useState({username: "", password: ""});
    const [confirmSignupDialogShow, setConfirmSignupDialogShow] = useState(false);
    const handleDialogClose = () => {
        setConfirmSignupDialogShow(false);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value,
        });
    };
    const confirmSignup = async () => {
        try {
            await accountsCon.signup(loginForm.username, loginForm.password);
            await accountsCon.login(loginForm.username, loginForm.password); //TODO Fix login function based on new implementation
            props.setLoginStateFunc(true);
        } catch (error: any) {
            alert(error.message);
        }
    };
    return (
        <div>
            <Grid container spacing={2} columns={{xs: 6, sm: 6, md: 12}}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <h2 style={{marginBottom: "20px"}}>
                                Sign Up/Login To Your Prior2Do Account
                            </h2>
                            <Box
                                component="form"
                                autoComplete="off"
                                sx={{
                                    "& .MuiTextField-root": {m: 1},
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircleOutlinedIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="standard"
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={loginForm.password}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="standard"
                                />
                            </Box>
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="center"
                                sx={{margin: "15px 0px"}}
                            >
                                <Button
                                    variant="contained"
                                    onClick={async () => {
                                        await accountsCon.login(
                                            // TODO update login error handling based on new implementation
                                            loginForm.username,
                                            loginForm.password
                                        );
                                        props.setLoginStateFunc(true);
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
                    <Card sx={{display: {xs: "none", sm: "none", md: "block"}}}>
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
                                            <DevicesOutlinedIcon/>
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
                                            <BackupOutlinedIcon/>
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
        </div>
    );
}
