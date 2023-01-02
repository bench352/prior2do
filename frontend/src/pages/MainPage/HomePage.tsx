import { useEffect, useState, useCallback } from "react";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import { Task } from "../../components/storage/StorageBackend";
import TaskCard from "../../components/userInterface/TaskCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import DoneOutlineOutlinedIcon from "@mui/icons-material/DoneOutlineOutlined";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";

export default function HomePage() {
  const filterTodayPlannedTask = (unfilteredTasks: any[]) => {
    return unfilteredTasks
      .filter((task: Task) => task.plannedDate !== null)
      .filter(
        (task: Task) =>
          new Date(task.plannedDate as Date).getDate() === new Date().getDate()
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
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(
    storageBackend.isWelcomeMessageShown()
  );
  const refreshTasks = useCallback(async () => {
    setTasks(await storageBackend.getTasks());
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks();
  },[]);
  const hideWelcomeMessage = () => {
    setShowWelcomeMessage(false);
    storageBackend.hideWelcomeMessage();
  };
  return (
    <div>
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
                  primary="Add Your Tasks"
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
    </div>
  );
}
