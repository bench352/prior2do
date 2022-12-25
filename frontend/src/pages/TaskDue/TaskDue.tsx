import Box from "@mui/material/Box";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import { useState } from "react";
import { Task, TaskWithDue } from "../../components/storage/StorageBackend";
import TaskCard from "../../components/userInterface/TaskCard";

export default function TaskDue() {
  const [tasks, setTasks] = useState(getStorageBackend().getTasks());
  const refreshTasks = () => {
    setTasks(getStorageBackend().getTasks());
  };
  return (
    <Box>
      <h2>Task Due</h2>
      <p>All the tasks with a due date. Don't miss a deadline!</p>
      {tasks
        .filter((task: Task) => task.dueDate !== null)
        .sort(
          (a: TaskWithDue, b: TaskWithDue) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
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
