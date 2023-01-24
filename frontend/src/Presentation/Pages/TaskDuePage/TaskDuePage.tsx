import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Task } from "../../../Data/schemas";
import { TasksViewProps } from "../../CommonView";
import TaskCard from "../../Components/TaskCard";

export default function TaskDuePage(props: TasksViewProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container disableGutters={isMobileScreenSize}>
      <h2>Task Due</h2>
      <p>All the tasks with a due date.</p>
      {props.tasks
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
            handleRefreshPage={props.handleRefreshPage}
          />
        ))}
    </Container>
  );
}
