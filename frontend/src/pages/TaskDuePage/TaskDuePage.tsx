import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { useCallback, useEffect, useState } from "react";
import {
  getStorageBackend,
  Task,
} from "../../components/storage/StorageBackend";
import LoadingBackdrop from "../../components/userInterface/LoadingBackdrop";
import TaskCard from "../../components/userInterface/TaskCard";

export default function TaskDuePage() {
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const [showLoadingBackdrop, setShowLoadingBackdrop] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleSnackbarClose = () => {
    setShowSnackBar(false);
  };
  const refreshTasks = useCallback(async () => {
    setShowLoadingBackdrop(true);
    let allTasks = [] as Task[];
    try {
      allTasks = await storageBackend.getTasks();
    } catch (error: any) {
      setSnackBarMessage(error.message);
      setShowSnackBar(true);
      allTasks = storageBackend.localGetTasks();
    }
    setTasks(allTasks);
    setShowLoadingBackdrop(false);
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks();
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
      <LoadingBackdrop open={showLoadingBackdrop} />
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
      />
    </Container>
  );
}
