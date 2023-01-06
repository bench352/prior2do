import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import { useCallback, useEffect, useState } from "react";
import {
  getStorageBackend,
  Task,
} from "../../components/storage/StorageBackend";
import AddTaskDialog from "../../components/userInterface/dialog/AddTaskDialog";
import LoadingBackdrop from "../../components/userInterface/LoadingBackdrop";
import TaskCard from "../../components/userInterface/TaskCard";

const floatingButtonStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

export default function AllTasksPage() {
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const [addTaskDialogEnabled, setAddTaskDialogEnabled] = useState(false);
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
    refreshTasks(); // eslint-disable-next-line
  }, []);
  const showAddTaskDialog = () => {
    setAddTaskDialogEnabled(true);
  };
  const hideAddTaskDialog = () => {
    setAddTaskDialogEnabled(false);
  };
  return (
    <Container>
      <Fab
        variant="extended"
        color="secondary"
        aria-label="add"
        sx={floatingButtonStyle}
        onClick={showAddTaskDialog}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Task
      </Fab>
      <h2>All Tasks</h2>
      <p>
        All your tasks at a glance. Add new tasks or update the details of
        existing tasks.
      </p>
      {tasks.map((task: Task) => (
        <TaskCard
          key={task.id}
          task={task}
          handleRefreshPage={refreshTasks}
          showEstTime={false}
        />
      ))}

      <AddTaskDialog
        open={addTaskDialogEnabled}
        handleHideDialog={hideAddTaskDialog}
        handleRefreshPage={refreshTasks}
      />
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
