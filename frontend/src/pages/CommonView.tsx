import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import OutlinedFlagSharpIcon from "@mui/icons-material/OutlinedFlagSharp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { isSyncEnabled } from "../components/storage/StorageBackend";
import AllTasksPage from "./AllTasksPage/AllTasksPage";
import HomePage from "./HomePage/HomePage";
import SettingsPage from "./SettingsPage/SettingsPage";
import TaskDuePage from "./TaskDuePage/TaskDuePage";
import TaskPlanPage from "./TaskPlanPage/TaskPlanPage";
import UserPage from "./UserPage/UserPage";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function CommonView() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showUser, setShowUser] = useState(isSyncEnabled());

  const changeUserOptionVisibility = (visibility: boolean) => {
    setShowUser(visibility);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Prior2Do
          </Typography>
          <Chip
            label="Beta"
            color="secondary"
            size="small"
            sx={{ "marginLeft": "10px" }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              name: "Home",
              icon: <HomeOutlinedIcon />,
              link: "/",
            },
            {
              name: "All Tasks",
              icon: <ListAltOutlinedIcon />,
              link: "/tasks",
            },
            {
              name: "Task Due",
              icon: <DateRangeOutlinedIcon />,
              link: "/due",
            },
            {
              name: "Task Plan",
              icon: <OutlinedFlagSharpIcon />,
              link: "/plan",
            },
          ].map((menuOption) => (
            <ListItem
              disablePadding
              key={menuOption.name}
              component={Link}
              to={menuOption.link}
              sx={{ "&:link": { color: "black" } }}
            >
              <ListItemButton>
                <ListItemIcon>{menuOption.icon}</ListItemIcon>
                <ListItemText primary={menuOption.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {showUser ? (
            <ListItem
              disablePadding
              component={Link}
              to="/user"
              sx={{ "&:link": { color: "black" } }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="User" />
              </ListItemButton>
            </ListItem>
          ) : (
            ""
          )}
          <ListItem
            disablePadding
            component={Link}
            to="/settings"
            sx={{ "&:link": { color: "black" } }}
          >
            <ListItemButton>
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="tasks" element={<AllTasksPage />} />
          <Route path="due" element={<TaskDuePage />} />
          <Route path="plan" element={<TaskPlanPage />} />
          <Route path="user" element={<UserPage />} />
          <Route
            path="settings"
            element={<SettingsPage showUser={changeUserOptionVisibility} />}
          />
        </Routes>
      </Main>
    </Box>
  );
}