import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState, useCallback } from "react";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import TaskPlanCard from "../../components/userInterface/TaskPlanCard";
import { Task } from "../../components/storage/StorageBackend";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TaskPlan() {
  const storageBackend = getStorageBackend();
  const [value, setValue] = useState(0);
  const [tasks, setTasks] = useState([] as Task[]);
  const refreshTasks = useCallback(async () => {
    setTasks(await storageBackend.getTasks());
  }, [storageBackend]);
  useEffect(() => {
    refreshTasks();
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
        {tasks
          .filter((task: Task) => task.plannedDate !== null)
          .sort(
            (a: Task, b: Task) =>
              new Date(a.plannedDate as Date).getTime() -
              new Date(b.plannedDate as Date).getTime()
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
          .filter((task: Task) => task.plannedDate === null)
          .map((task: Task) => (
            <TaskPlanCard
              key={task.id}
              task={task}
              handleRefreshPage={refreshTasks}
            />
          ))}
      </TabPanel>
    </Box>
  );
}
