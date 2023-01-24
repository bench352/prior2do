import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TagsController } from "../../../Controller/Tags";
import { Task } from "../../../Data/schemas";
import { TasksViewProps } from "../../CommonView";
import AddTaskDialog from "../../Components/dialog/AddTaskDialog";
import TaskCard from "../../Components/TaskCard";

const floatingButtonStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};
const tagsCon = new TagsController();

interface TasksPageProps extends TasksViewProps {
  createInfoSnackBar(message: string): any;
}

export default function TasksPage(props: TasksPageProps) {
  const location = useLocation();
  const [tasks, setTasks] = useState(props.tasks);
  const [pageTitle, setPageTitle] = useState("All Tasks");
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [addTaskDialogEnabled, setAddTaskDialogEnabled] = useState(false);
  const handleQuery = useCallback(
    async (tagId: string) => {
      if (tagId !== "") {
        try {
          let tag = await tagsCon.getTagById(tagId);
          setPageTitle(`Tasks of ${tag.name}`);
          setTasks(props.tasks.filter((task) => task.tagId === tagId));
        } catch (error: any) {
          props.createInfoSnackBar(error.message);
          setPageTitle("All Tasks");
          setTasks(props.tasks);
        }
      } else {
        setPageTitle("All Tasks");
        setTasks(props.tasks);
      }
    },
    [props]
  );
  const showAddTaskDialog = () => {
    setAddTaskDialogEnabled(true);
  };
  const hideAddTaskDialog = () => {
    setAddTaskDialogEnabled(false);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    handleQuery(queryParams.get("tagId") || "");
  }, [handleQuery, location.search, props]);
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
      <h2>{pageTitle}</h2>
      {tasks.map((task: Task) => (
        <TaskCard
          key={task.id}
          task={task}
          handleRefreshPage={props.handleRefreshPage}
        />
      ))}

      <AddTaskDialog
        open={addTaskDialogEnabled}
        handleHideDialog={hideAddTaskDialog}
        handleRefreshPage={props.handleRefreshPage}
      />
    </Container>
  );
}
