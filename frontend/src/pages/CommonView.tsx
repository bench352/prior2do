import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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

export default function CommonView() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUser, setShowUser] = useState(isSyncEnabled());
  const [showLoading, setShowLoading] = useState(false);
  const changeUserOptionVisibility = (visibility: boolean) => {
    setShowUser(visibility);
  };
  const changeLoadingVisibility = (visibility: boolean) => {
    setShowLoading(visibility);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
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
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Prior2Do
          </Typography>
          <Chip
            label="Beta"
            color="secondary"
            size="small"
            sx={{ marginLeft: "10px" }}
          />
          {showLoading ? (
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "right" }}
            >
              <CircularProgress sx={{ color: "white" }} />
            </Box>
          ) : (
            ""
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            display: { xs: "block", sm: "none" },
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
            display: { xs: "none", sm: "block" },
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
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
        }}
      >
        <Toolbar />
        <Routes>
          <Route
            path="/*"
            element={<HomePage showLoading={changeLoadingVisibility} />}
          />
          <Route
            path="tasks"
            element={<AllTasksPage showLoading={changeLoadingVisibility} />}
          />
          <Route
            path="due"
            element={<TaskDuePage showLoading={changeLoadingVisibility} />}
          />
          <Route
            path="plan"
            element={<TaskPlanPage showLoading={changeLoadingVisibility} />}
          />
          <Route path="user" element={<UserPage />} />
          <Route
            path="settings"
            element={<SettingsPage showUser={changeUserOptionVisibility} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}
