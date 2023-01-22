import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useState } from "react";
import TaskCard from "../../Components/TaskCard";
import { Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";

interface TaskDuePageProps {
  showLoading(visibility: boolean): any;
}

const tasksCon = new TasksController();

export default function TaskDuePage(props: TaskDuePageProps) {
  const [initialProps] = useState(props);
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [tasks, setTasks] = useState([] as Task[]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleSnackbarClose = () => {
    setShowSnackBar(false);
  };
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
  return (
    <Container disableGutters={isMobileScreenSize}>
      <h2>Task Due</h2>
      <p>All the tasks with a due date.</p>
      {tasks
        .filter((task: Task) => task.dueDate !== null)
        .sort(
          (a: Task, b: Task) =>
            new Date(a.dueDate as Date).getTime() -
            new Date(b.dueDate as Date).getTime()
        )
        .map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            handleRefreshPage={refreshTasks}
            showEstTime={false}
          />
        ))}
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
      />
    </Container>
  );
}