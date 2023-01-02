import Box from "@mui/material/Box";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import { useEffect, useState, useCallback } from "react";
import { Task } from "../../components/storage/StorageBackend";
import TaskCard from "../../components/userInterface/TaskCard";

export default function TaskDue() {
  const storageBackend = getStorageBackend();
  const [tasks, setTasks] = useState([] as Task[]);
  const refreshTasks = useCallback(async () => {
    setTasks(await storageBackend.getTasks());
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks();
  }, []);
  return (
    <Box>
      <h2>Task Due</h2>
      <p>All the tasks with a due date. Don't miss a deadline!</p>
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
    </Box>
  );
}
