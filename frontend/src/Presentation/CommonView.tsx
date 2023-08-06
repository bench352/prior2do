import AddIcon from "@mui/icons-material/Add";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OutlinedFlagSharpIcon from "@mui/icons-material/OutlinedFlagSharp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {useCallback, useEffect, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {SettingsController} from "../Controller/Settings";
import {TagsController} from "../Controller/Tags";
import {TasksController} from "../Controller/Tasks";
import {getNewUniqueId} from "../Controller/Uuid";
import {WorkSessionsController} from "../Controller/WorkSessions";
import {Tag, Task, UILanguages, WorkSession} from "../Data/schemas";
import TagEditDialog from "./Components/dialog/TagEditDialog";
import ReleaseDialog from "./Components/dialog/settings/ReleaseDialog";
import LanguageIcon from "@mui/icons-material/Language";
import LanguageSelectDialog from "./Components/dialog/misc/LanguageSelectDialog";
import SingleTextInputDialog from "./Components/dialog/misc/SingleTextInputDialog";
import DueCalendarPage from "./Pages/DueCalPage/DueCalPage";
import HomePage from "./Pages/HomePage/HomePage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import TaskPlanPage from "./Pages/TaskPlanPage/TaskPlanPage";
import TasksPage from "./Pages/TasksPage/TasksPage";
import UserPage from "./Pages/UserPage/UserPage";
import {useTranslation} from "react-i18next";

const drawerWidth = 240;

export interface TasksViewProps {
    tasks: Task[];

    handleRefreshPage(): any;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();
const workSessionsCon = new WorkSessionsController();

export default function CommonView() {
    const {i18n, t} = useTranslation();
    let settingsCon = new SettingsController();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [showUser, setShowUser] = useState(settingsCon.getIsSyncEnabled());
    const [showLoading, setShowLoading] = useState(false);
    const [showTagEditDialog, setShowTagEditDialog] = useState(false);
    const [showReleaseDialog, setShowReleaseDialog] = useState(
        settingsCon.isReleaseDialogShown()
    );
    const [showLanguageSelectDialog, setShowLanguageSelectDialog] =
        useState(false);
    const [showInfoSnackBar, setShowInfoSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const createInfoSnackBar = (message: string) => {
        setSnackBarMessage(message);
        setShowInfoSnackBar(true);
    };
    const [tasks, setTasks] = useState([] as Task[]);
    const [tags, setTags] = useState([] as Tag[]);
    const [workSessions, setWorkSessions] = useState([] as WorkSession[]);
    const refreshPage = useCallback(async () => {
        setShowLoading(true);
        setTasks(tasksCon.offlineGetTasks());
        try {
            setTasks(await tasksCon.getTasks());
        } catch (error: any) {
            createInfoSnackBar(error.message);
        }
        try {
            setTags(await tagsCon.getTags());
        } catch (error: any) {
            createInfoSnackBar(error.message);
        }
        try {
            setWorkSessions(await workSessionsCon.getAllWorkSessions());
        } catch (error: any) {
            createInfoSnackBar(error.message);
        }
        setShowLoading(false);
    }, []);
    const [showAddTagDialog, setShowAddTagDialog] = useState(false);
    const handleCloseReleaseDialog = () => {
        settingsCon.markCurrentVersionViewed();
        setShowReleaseDialog(false);
    };
    const handleCloseAddTagDialog = () => {
        setShowAddTagDialog(false);
    };
    const changeUserOptionVisibility = (visibility: boolean) => {
        setShowUser(visibility);
    };
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleCloseTagEditDialog = () => {
        setShowTagEditDialog(false);
    };
    const createTag = (name: string) => {
        tagsCon.createTag({name: name, id: getNewUniqueId()});
        refreshPage();
    };
    useEffect(() => {
        i18n.changeLanguage(settingsCon.getLanguage());
        refreshPage();
    }, [refreshPage]);
    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List subheader={<ListSubheader>{t("sideMenu.features")}</ListSubheader>}>
                {[
                    {
                        name: t("sideMenu.dashboard"),
                        icon: <DashboardOutlinedIcon/>,
                        link: "/",
                    },
                    {
                        name: t("sideMenu.tasks"),
                        icon: <ListAltOutlinedIcon/>,
                        link: "/tasks",
                    },
                    {
                        name: t("sideMenu.calendar"),
                        icon: <CalendarMonthOutlinedIcon/>,
                        link: "/calendar",
                    },
                    {
                        name: t("sideMenu.plan"),
                        icon: <OutlinedFlagSharpIcon/>,
                        link: "/plan",
                    },
                ].map((menuOption) => (
                    <ListItem
                        disablePadding
                        key={menuOption.name}
                        component={Link}
                        to={menuOption.link}
                        sx={{"&:link": {color: "black"}}}
                    >
                        <ListItemButton>
                            <ListItemIcon>{menuOption.icon}</ListItemIcon>
                            <ListItemText primary={menuOption.name}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List
                subheader={
                    <ListSubheader>
                        {t("sideMenu.tags")}
                        <Tooltip title={t("sideMenu.toolTip.tagEdit")} placement="right">
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => {
                                    setShowTagEditDialog(true);
                                }}
                            >
                                <EditOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </ListSubheader>
                }
            >
                {tags
                    .sort((a: Tag, b: Tag) => a.name.localeCompare(b.name))
                    .map((tag) => (
                        <ListItem
                            disablePadding
                            key={tag.name}
                            component={Link}
                            to={`/tasks?tagId=${tag.id}`}
                            sx={{"&:link": {color: "black"}}}
                        >
                            <ListItemButton>
                                <Chip icon={<LabelOutlinedIcon/>} label={tag.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                <ListItem disablePadding sx={{"&:link": {color: "black"}}}>
                    <ListItemButton
                        onClick={() => {
                            setShowAddTagDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary={t("sideMenu.addTag")}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                {showUser ? (
                    <ListItem
                        disablePadding
                        component={Link}
                        to="/user"
                        sx={{"&:link": {color: "black"}}}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <PersonOutlineOutlinedIcon/>
                            </ListItemIcon>
                            <ListItemText primary={t("sideMenu.user")}/>
                        </ListItemButton>
                    </ListItem>
                ) : (
                    ""
                )}
                <ListItem
                    disablePadding
                    component={Link}
                    to="/settings"
                    sx={{"&:link": {color: "black"}}}
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsOutlinedIcon/>
                        </ListItemIcon>
                        <ListItemText primary={t("sideMenu.settings")}/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{"&:link": {color: "black"}}}>
                    <ListItemButton
                        onClick={() => {
                            setShowLanguageSelectDialog(true);
                        }}
                    >
                        <ListItemIcon>
                            <LanguageIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                t("sideMenu.language") +
                                (i18n.language !== "en" ? " (Language)" : "")
                            }
                            secondary={UILanguages[i18n.language]}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    width: {sm: `calc(100% - ${drawerWidth}px)`},
                    ml: {sm: `${drawerWidth}px`},
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: "none"}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        {t("navBar.appName") +
                            (i18n.language !== "en" ? " (Prior2Do)" : "")}
                    </Typography>
                    <Chip
                        label={t("navBar.tag")}
                        color="secondary"
                        size="small"
                        sx={{marginLeft: "10px"}}
                    />
                    {showLoading ? (
                        <Box
                            sx={{width: "100%", display: "flex", justifyContent: "right"}}
                        >
                            <CircularProgress sx={{color: "white"}}/>
                        </Box>
                    ) : (
                        ""
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: "block", sm: "none"},
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: "none", sm: "block"},
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: {sm: `calc(100% - ${drawerWidth}px)`, xs: "100%"},
                }}
            >
                <Toolbar/>
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <HomePage
                                tasks={tasks}
                                workSessions={workSessions}
                                handleRefreshPage={refreshPage}
                            />
                        }
                    />
                    <Route
                        path="tasks"
                        element={
                            <TasksPage
                                tasks={tasks}
                                handleRefreshPage={refreshPage}
                                createInfoSnackBar={createInfoSnackBar}
                            />
                        }
                    />
                    <Route
                        path="calendar"
                        element={
                            <DueCalendarPage
                                tasks={tasks}
                                tags={tags}
                                handleRefreshPage={refreshPage}
                            />
                        }
                    />
                    <Route
                        path="plan"
                        element={
                            <TaskPlanPage
                                tasks={tasks}
                                tags={tags}
                                workSessions={workSessions}
                                handleRefreshPage={refreshPage}
                            />
                        }
                    />
                    <Route path="user" element={<UserPage/>}/>
                    <Route
                        path="settings"
                        element={<SettingsPage showUser={changeUserOptionVisibility}/>}
                    />
                </Routes>
            </Box>
            <ReleaseDialog
                open={showReleaseDialog}
                handleHideDialog={handleCloseReleaseDialog}
            />
            <TagEditDialog
                open={showTagEditDialog}
                tags={tags}
                handleHideDialog={handleCloseTagEditDialog}
                handleRefreshPage={refreshPage}
            />
            <SingleTextInputDialog
                title={t("dialogs.tagRelated.addTag.title")}
                message={t("dialogs.tagRelated.addTag.description.label")}
                open={showAddTagDialog}
                handleClose={handleCloseAddTagDialog}
                setConfirmValue={createTag}
            />
            <LanguageSelectDialog
                open={showLanguageSelectDialog}
                handleClose={() => {
                    setShowLanguageSelectDialog(false);
                }}
                handleLanguageChange={(language) => {
                    i18n.changeLanguage(language).then(() => {
                        settingsCon.setLanguage(language);
                    });
                }}
            />
            <Snackbar
                open={showInfoSnackBar}
                autoHideDuration={6000}
                onClose={() => {
                    setShowInfoSnackBar(false);
                }}
                message={snackBarMessage}
            />
        </Box>
    );
}
