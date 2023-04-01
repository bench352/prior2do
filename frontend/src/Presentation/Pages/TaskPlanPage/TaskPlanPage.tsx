import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import React, { useCallback, useEffect, useState } from "react";
import { TasksController } from "../../../Controller/Tasks";
import { Tag, Task, WorkSession } from "../../../Data/schemas";
import { TasksViewProps } from "../../CommonView";
import TaskPlanCard from "../../Components/cards/TaskPlanCard";
import WorkSessionCard from "../../Components/cards/WorkSessionCard";
import EditWorkSessionDialog from "../../Components/dialog/plans/EditWorkSessionDialog";

interface TaskPlanPageProps extends TasksViewProps {
  tags: Tag[];
  workSessions: WorkSession[];
}

function ViewTasks(props: { tasks: Task[]; handleRefreshPage: () => any }) {
  return (
    <>
      {props.tasks.map((task) => (
        <TaskPlanCard
          task={task}
          handleRefreshPage={props.handleRefreshPage}
          key={task.id}
        />
      ))}
    </>
  );
}

const tasksCon = new TasksController();

function ViewPlans(props: {
  workSessions: WorkSession[];
  handleRefreshPage: () => any;
}) {
  const groupedObjects = props.workSessions.reduce((map, obj) => {
    const date = dateFormat(obj.date, "mmm dd, yyyy");
    map.has(date) ? map.get(date)?.push(obj) : map.set(date, [obj]);
    return map;
  }, new Map() as Map<string, WorkSession[]>);
  const sortedGroups = Array.from(groupedObjects).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return (
    <>
      {Array.from(sortedGroups).map(([date, sessions]) => (
        <>
          <h5>{date}</h5>
          {sessions.map((session) => (
            <WorkSessionCard
              session={session}
              handleRefreshPage={props.handleRefreshPage}
            />
          ))}
        </>
      ))}
    </>
  );
}

export default function TaskPlanPage(props: TaskPlanPageProps) {
  const [leftPaneView, setLeftPaneView] = useState("Tasks");
  const [calendarSessions, setCalendarSessions] = useState([] as any[]);
  const [selectedSession, setSelectedSession] = useState(
    null as WorkSession | null
  );
  const [showEditSessionDialog, setShowEditSessionDialog] = useState(false);
  const handlePageViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string | null
  ) => {
    if (newSelection) setLeftPaneView(newSelection);
  };

  const asyncGetCalView = useCallback(async () => {
    let calPromises = props.workSessions.map(async (session) => {
      const task = await tasksCon.getTaskById(session.taskId);
      return {
        id: session.id,
        title: `[${session.duration}h] ${task.name}`,
        date: dateFormat(session.date, "yyyy-mm-dd"),
      };
    });
    let events = await Promise.all(calPromises);
    setCalendarSessions(events);
  }, [props.workSessions]);
  useEffect(() => {
    asyncGetCalView();
  }, [asyncGetCalView, props]);
  return (
    <Box>
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
          Task Plan
        </Typography>
      </Stack>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
        columns={{ xs: 4, md: 12 }}
      >
        <Grid item xs={4}>
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ height: "40px" }}
            >
              <Typography
                component="h2"
                variant="h6"
                sx={{ fontWeight: "bold" }}
                noWrap
              >
                {leftPaneView}
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={leftPaneView}
                onChange={handlePageViewChange}
                size="small"
              >
                <ToggleButton value="Tasks">
                  <Tooltip title="View tasks">
                    <TaskAltOutlinedIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="Plans">
                  <Tooltip title="View plans">
                    <FlagOutlinedIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {leftPaneView === "Tasks" ? (
              <ViewTasks
                tasks={props.tasks}
                handleRefreshPage={props.handleRefreshPage}
              />
            ) : (
              ""
            )}
            {leftPaneView === "Plans" ? (
              <ViewPlans
                workSessions={props.workSessions}
                handleRefreshPage={props.handleRefreshPage}
              />
            ) : (
              ""
            )}
          </>
        </Grid>
        <Grid item xs={4} md={8} sx={{ display: { xs: "none", md: "block" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "40px" }}
          >
            <Typography
              component="h2"
              variant="h6"
              sx={{ fontWeight: "bold" }}
              noWrap
            >
              Calendar View
            </Typography>
          </Stack>
          <FullCalendar
            height="auto"
            titleFormat={{ year: "numeric", month: "short" }}
            plugins={[dayGridPlugin]}
            events={calendarSessions}
            eventClick={(info) => {
              setSelectedSession(
                props.workSessions.find(
                  (session) => session.id === info.event.id
                ) as WorkSession
              );
              setShowEditSessionDialog(true);
            }}
            initialView="dayGridMonth"
          />
        </Grid>
      </Grid>
      {selectedSession ? (
        <EditWorkSessionDialog
          existingWorkSession={selectedSession}
          open={showEditSessionDialog}
          handleClose={() => {
            setShowEditSessionDialog(false);
          }}
          handleRefreshPage={props.handleRefreshPage}
        />
      ) : (
        ""
      )}
    </Box>
  );
}
