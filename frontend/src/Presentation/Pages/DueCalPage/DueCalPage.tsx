import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TasksViewProps } from "../../CommonView";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dateFormat from "dateformat";
import AddTaskDialog from "../../Components/dialog/AddTaskDialog";
import EditTaskDialog from "../../Components/dialog/EditTaskDialog";
import { useState } from "react";
import { Tag, Task } from "../../../Data/schemas";
import { TasksController } from "../../../Controller/Tasks";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const tasksCon = new TasksController();

interface TaskCalPageProps extends TasksViewProps {
  tags: Tag[];
}

export default function DueCalendarPage(props: TaskCalPageProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const handleCloseAddTaskDialog = () => {
    setShowAddTaskDialog(false);
  };
  const [selectedTask, setSelectedTask] = useState(null as Task | null);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const handleCloseEditTaskDialog = () => {
    setShowEditTaskDialog(false);
  };
  const [filterTagId, setFilterTagId] = useState("");
  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilterTagId(e.target.value);
  };
  return (
    <Container disableGutters={isMobileScreenSize}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ marginBottom: "10px" }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "bold" }}
          noWrap
        >
          Due Calendar
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filter-by-tag">Filter By</InputLabel>
          <Select
            id="filter-by-tag"
            value={filterTagId}
            onChange={handleFilterChange}
            label="Filter By"
          >
            <MenuItem value="">
              <em>No Filter</em>
            </MenuItem>
            {props.tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <FullCalendar
        height="auto"
        plugins={[interactionPlugin, dayGridPlugin]}
        titleFormat={{ year: "numeric", month: "short" }}
        initialView="dayGridMonth"
        dateClick={(info) => {
          setSelectedDate(info.dateStr);
          setShowAddTaskDialog(true);
        }}
        eventClick={async (info) => {
          setSelectedTask(await tasksCon.getTaskById(info.event.id));
          setShowEditTaskDialog(true);
        }}
        events={props.tasks
          .filter((task) => task.dueDate !== null)
          .filter((task) =>
            filterTagId !== "" ? filterTagId === task.tagId : true
          )
          .map((task) => {
            return {
              id: task.id,
              title: task.name,
              start: dateFormat(task.dueDate as Date, "yyyy-mm-dd"),
            };
          })}
      />
      <AddTaskDialog
        open={showAddTaskDialog}
        handleHideDialog={handleCloseAddTaskDialog}
        handleRefreshPage={props.handleRefreshPage}
        defaultTagId={filterTagId}
        defaultDate={selectedDate}
      />
      {selectedTask ? (
        <EditTaskDialog
          open={showEditTaskDialog}
          handleHideDialog={handleCloseEditTaskDialog}
          handleRefreshPage={props.handleRefreshPage}
          existingTask={selectedTask}
        />
      ) : (
        ""
      )}
    </Container>
  );
}
