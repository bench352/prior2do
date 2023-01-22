import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useCallback, useEffect, useState } from "react";
import { TasksController } from "../../../Controller/Tasks";
import { Task } from "../../../Data/schemas";
import TaskPlanCard from "../../Components/TaskPlanCard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const tasksCon = new TasksController();

interface TaskPlanPageProps {
  showLoading(visibility: boolean): any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TaskPlanPage(props: TaskPlanPageProps) {
  const [initialProps] = useState(props);

  const [value, setValue] = useState(0);
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
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <h2>Task Plan</h2>
      <p>
        Always plan ahead of time so you won't get lost as you go. Schedule a
        date for working on each task and estimate how much time you need to
        complete it.
      </p>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Task Plan View"
          variant="fullWidth"
        >
          <Tab label="Planned Tasks" {...a11yProps(0)} />
          <Tab label="Unplanned Tasks" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {" "}
        {/* TODO Implement WORKING filter function based on new schema */}
        {tasks
          .filter((task: Task) => task.planned[0].date !== null)
          .sort(
            (a: Task, b: Task) =>
              new Date(a.planned[0].date as Date).getTime() -
              new Date(b.planned[0].date as Date).getTime()
          )
          .map((task: Task) => (
            <TaskPlanCard
              key={task.id}
              task={task}
              handleRefreshPage={refreshTasks}
            />
          ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {tasks
          .filter((task: Task) => task.planned[0].date === null)
          .map((task: Task) => (
            <TaskPlanCard
              key={task.id}
              task={task}
              handleRefreshPage={refreshTasks}
            />
          ))}
      </TabPanel>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackBarMessage}
      />
    </Container>
  );
}
