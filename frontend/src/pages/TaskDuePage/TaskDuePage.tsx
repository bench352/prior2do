import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { useCallback, useEffect, useState } from "react";
import {
  getStorageBackend,
  Task,
} from "../../components/storage/StorageBackend";
import TaskCard from "../../components/userInterface/TaskCard";

interface TaskDuePageProps {
  showLoading(visibility: boolean): any;
}

export default function TaskDuePage(props: TaskDuePageProps) {
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleSnackbarClose = () => {
    setShowSnackBar(false);
  };
  const refreshTasks = useCallback(async () => {
    props.showLoading(true);
    setTasks(storageBackend.localGetTasks());
    try {
      setTasks(await storageBackend.getTasks());
    } catch (error: any) {
      setSnackBarMessage(error.message);
      setShowSnackBar(true);
    }
    props.showLoading(false);
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks(); // eslint-disable-next-line
  }, []);
  return (
    <Container>
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
