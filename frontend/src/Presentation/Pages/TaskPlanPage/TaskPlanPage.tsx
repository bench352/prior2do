import Grid from "@mui/material/Grid";
import { TasksViewProps } from "../../CommonView";
import Box from "@mui/material/Box";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Tag } from "../../../Data/schemas";
import TaskPlanCard from "../../Components/TaskPlanCard";
import Tooltip from "@mui/material/Tooltip";

interface TaskPlanPageProps extends TasksViewProps {
  tags: Tag[];
}

export default function TaskPlanPage(props: TaskPlanPageProps) {
  const [leftPaneView, setLeftPaneView] = useState("Tasks");
  const handlePageViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string | null
  ) => {
    if (newSelection) setLeftPaneView(newSelection);
  };
  const [filterTagId, setFilterTagId] = useState("");
  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilterTagId(e.target.value);
  };

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

            {props.tasks.map((task) => (
              <TaskPlanCard
                task={task}
                handleRefreshPage={props.handleRefreshPage}
                key={task.id}
              />
            ))}
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
            initialView="dayGridMonth"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
