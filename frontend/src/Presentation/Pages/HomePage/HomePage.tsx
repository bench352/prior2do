import DoneOutlineOutlinedIcon from "@mui/icons-material/DoneOutlineOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useState } from "react";
import TaskCard from "../../Components/TaskCard";
import { Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";
import { SettingsController } from "../../../Controller/Settings";
interface HomePageProps {
  showLoading(visibility: boolean): any;
}

const settingsCon = new SettingsController();
const tasksCon = new TasksController();

export default function HomePage(props: HomePageProps) {
  const [initialProps] = useState(props);
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const filterTodayPlannedTask = (unfilteredTasks: any[]) => {
    return unfilteredTasks
      .filter((task: Task) => task.planned !== null) // TODO Implement WORKING filter function based on new schema
      .filter(
        (task: Task) =>
          new Date(task.planned[0].date as Date).getDate() ===
          new Date().getDate()
      )
      .map((task: Task) => (
        <TaskCard
          key={task.id}
          task={task}
          handleRefreshPage={refreshTasks}
          showEstTime={true}
        />
      ));
  };
  const [tasks, setTasks] = useState([] as Task[]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackBar(false);
  };
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(
    settingsCon.getIsWelcomeShown()
  );
  const refreshTasks = useCallback(async () => {
    initialProps.showLoading(true);
    setTasks(tasksCon.offlineGetTasks());
    try {
      setTasks(await tasksCon.getTasks());
    } catch (error: any) {
      setSnackBarMessage(error.message);
      setShowSnackBar(true);
    }
    initialProps.showLoading(false);
  }, [initialProps]);
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);
  const hideWelcomeMessage = () => {
    setShowWelcomeMessage(false);
    settingsCon.hideWelcomeMessage();
  };
  return (
    <Container disableGutters={isMobileScreenSize}>
      {showWelcomeMessage ? (
        <Card sx={{ margin: "0px 0px 15px 0px" }}>
          <CardContent>
            <h2>Welcome to Prior2Do!</h2>
            <h3>
              A to-do app that goes one step further to accelerate your
              productivity
            </h3>
            <p>
              While a typical to-do app offers a way to track your tasks,{" "}
              <strong>Prior2Do</strong> offers more - by giving you a convenient
              way to plan your tasks ahead of time. With{" "}
              <strong>Prior2Do</strong>, you can grind through your work with
              peace of mind with three simple steps:
            </p>
            <List sx={{ width: "100%" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PlaylistAddOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Track Your Tasks"
                  secondary="Add all your tasks to the app to track what you have to do."
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <OutlinedFlagIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Plan Your Tasks"
                  secondary="Schedule dates to complete your tasks. To use your time more efficiently, you can estimate how much time you need for a task too."
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <DoneOutlineOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Complete Your Tasks"
                  secondary="Complete your tasks based on your plan."
                />
              </ListItem>
            </List>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={hideWelcomeMessage}>
              Got It!
            </Button>
          </CardActions>
        </Card>
      ) : (
        ""
      )}

      <h2>Planned On Today</h2>
      {filterTodayPlannedTask(tasks)}
      {filterTodayPlannedTask(tasks).length === 0 ? (
        <p>No tasks planned on today. Enjoy your peace of mind!</p>
      ) : (
        ""
      )}
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
      />
    </Container>
  );
}
