import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useState } from "react";
import {
  getStorageBackend,
  TaskV0,
} from "../../../components/storage/StorageBackend";
import AddTaskDialog from "../../UserInterface/dialog/AddTaskDialog";
import TaskCard from "../../../components/userInterface/TaskCard";

const floatingButtonStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

interface AllTaskPageProps {
  showLoading(visibility: boolean): any;
}

export default function AllTasksPage(props: AllTaskPageProps) {
  const [initialProps] = useState(props);
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [tasks, setTasks] = useState([] as TaskV0[]);
  const [addTaskDialogEnabled, setAddTaskDialogEnabled] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const handleSnackbarClose = () => {
    setShowSnackBar(false);
  };
  const refreshTasks = useCallback(async () => {
    const storageBackend = getStorageBackend();
    initialProps.showLoading(true);
    setTasks(storageBackend.localGetTasks());
    try {
      setTasks(await storageBackend.getTasks());
    } catch (error: any) {
      setSnackBarMessage(error.message);
      setShowSnackBar(true);
    }
    initialProps.showLoading(false);
  }, [initialProps]);
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);
  const showAddTaskDialog = () => {
    setAddTaskDialogEnabled(true);
  };
  const hideAddTaskDialog = () => {
    setAddTaskDialogEnabled(false);
  };
  return (
    <Container disableGutters={isMobileScreenSize}>
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
      {tasks.map((task: TaskV0) => (
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
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
      />
    </Container>
  );
}
