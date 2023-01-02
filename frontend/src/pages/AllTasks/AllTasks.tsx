import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../../components/userInterface/TaskCard";
import AddTaskDialog from "../../components/userInterface/dialog/AddTaskDialog";
import { useState, useEffect, useCallback } from "react";
import {
  getStorageBackend,
  Task,
} from "../../components/storage/StorageBackend";

const floatingButtonStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

export default function AllTasks() {
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const [addTaskDialogEnabled, setAddTaskDialogEnabled] = useState(false);
  const refreshTasks = useCallback(async () => {
    setTasks(await storageBackend.getTasks());
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks();
  }, []);
  const showAddTaskDialog = () => {
    setAddTaskDialogEnabled(true);
  };
  const hideAddTaskDialog = () => {
    setAddTaskDialogEnabled(false);
  };
  return (
    <Box>
      <Fab
        variant="extended"
        color="primary"
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
    </Box>
  );
}
