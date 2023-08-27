import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {TagsController} from "../../../Controller/Tags";
import {Task} from "../../../Data/schemas";
import {TasksViewProps} from "../../CommonView";
import AddTaskDialog from "../../Components/dialog/tasks/AddTaskDialog";
import TaskCard from "../../Components/cards/TaskCard";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import {TasksController} from "../../../Controller/Tasks";
import {getNewUniqueId} from "../../../Controller/Uuid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import {Typography} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import Collapse from "@mui/material/Collapse";
import {TransitionGroup} from "react-transition-group";
import {useTranslation} from "react-i18next";

const floatingButtonStyle = {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
};

const tagsCon = new TagsController();
const tasksCon = new TasksController();

interface TasksPageProps extends TasksViewProps {
    createInfoSnackBar(message: string): any;
}

export default function TasksPage(props: TasksPageProps) {
    const {t} = useTranslation();
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState(t("tasks.title"));
    const [tagFilter, setTagFilter] = useState("");
    const [taskFilterOption, setTaskFilterOption] = useState("name");
    const [reverseSort, setReverseSort] = useState(false);
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));
    const [addTaskDialogEnabled, setAddTaskDialogEnabled] = useState(false);
    const [quickAddTaskField, setQuickAddTaskField] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setQuickAddTaskField(value);
    };
    const handleToggleChange = (
        e: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            setTaskFilterOption(newValue);
        }
    };
    const handleQuery = useCallback(async () => {
        if (tagFilter !== "") {
            try {
                let tag = await tagsCon.getTagById(tagFilter);
                setPageTitle(tag.name);
            } catch (error: any) {
                props.createInfoSnackBar(error.message);
                setPageTitle(t("tasks.title"));
                setTagFilter("");
            }
        } else {
            setPageTitle(t("tasks.title"));
        }
    }, [props, t, tagFilter]);
    const showAddTaskDialog = () => {
        setAddTaskDialogEnabled(true);
    };
    const hideAddTaskDialog = () => {
        setAddTaskDialogEnabled(false);
    };
    const quickAddNewTask = async () => {
        await tasksCon.addTask({
            name: quickAddTaskField,
            dueDate: null,
            description: "",
            estimatedHours: 0,
            completed: false,
            subTasks: [],
            tagId: tagFilter !== "" ? tagFilter : null,
            issueId: null,
            id: getNewUniqueId(),
        });
        setQuickAddTaskField("");
        props.handleRefreshPage();
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setTagFilter(queryParams.get("tagId") || "");
        handleQuery();
    }, [handleQuery, location.search, props.tasks]);
    return (
        <Container disableGutters={isMobileScreenSize}>
            <Fab
                variant="extended"
                color="secondary"
                aria-label="add"
                sx={floatingButtonStyle}
                onClick={showAddTaskDialog}
            >
                <AddIcon sx={{mr: 1}}/>
                {t("tasks.button.create")}
            </Fab>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{fontWeight: "bold"}}
                    noWrap
                >
                    {pageTitle}
                </Typography>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Tooltip title={t("tasks.toolTip.reverse")}>
                        <IconButton
                            value="check"
                            onClick={() => {
                                setReverseSort(!reverseSort);
                            }}
                        >
                            {reverseSort ? (
                                <ArrowUpwardOutlinedIcon/>
                            ) : (
                                <ArrowDownwardOutlinedIcon/>
                            )}
                        </IconButton>
                    </Tooltip>
                    <ToggleButtonGroup
                        size="small"
                        value={taskFilterOption}
                        onChange={handleToggleChange}
                        exclusive
                    >
                        <ToggleButton value="name">
                            <Tooltip title={t("tasks.sort.byTaskName")}>
                                <TitleOutlinedIcon/>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="due">
                            <Tooltip title={t("tasks.sort.byDueDate")}>
                                <EventOutlinedIcon/>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="estTime">
                            <Tooltip title={t("tasks.sort.byEstTime")}>
                                <TimerOutlinedIcon/>
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Stack>
            <TransitionGroup>
                {props.tasks
                    .filter((task) =>
                        tagFilter !== "" ? task.tagId === tagFilter : true
                    )
                    .sort((a, b) => {
                        let evaluatedVal = 0;
                        switch (taskFilterOption) {
                            case "name":
                                evaluatedVal = a.name.localeCompare(b.name);
                                break;
                            case "due":
                                if (a.dueDate === null && b.dueDate === null)
                                    return a.name.localeCompare(b.name);
                                else if (a.dueDate === null) return 1;
                                else if (b.dueDate === null) return -1;
                                else {
                                    evaluatedVal =
                                        new Date(a.dueDate || 0).getTime() -
                                        new Date(b.dueDate || 0).getTime();
                                }
                                break;
                            case "estTime":
                                if (a.estimatedHours === 0) return a.name.localeCompare(b.name);
                                evaluatedVal = a.estimatedHours - b.estimatedHours;
                                break;
                            default:
                                return 0;
                        }
                        if (reverseSort) {
                            evaluatedVal *= -1;
                        }
                        return evaluatedVal;
                    })
                    .map((task: Task) => (
                        <Collapse key={task.id}>
                            <TaskCard
                                task={task}
                                handleRefreshPage={props.handleRefreshPage}
                            />
                        </Collapse>
                    ))}
            </TransitionGroup>

            <AddTaskDialog
                open={addTaskDialogEnabled}
                defaultTagId={tagFilter}
                handleHideDialog={hideAddTaskDialog}
                handleRefreshPage={props.handleRefreshPage}
            />
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
                <IconButton
                    disabled={quickAddTaskField.trim().length === 0}
                    onClick={quickAddNewTask}
                >
                    <AddIcon/>
                </IconButton>
                <InputBase
                    fullWidth
                    placeholder={t("tasks.button.quickAdd")}
                    value={quickAddTaskField}
                    onChange={handleInputChange}
                    onKeyDown={async (e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                            await quickAddNewTask();
                        }
                    }}
                />
            </Stack>
        </Container>
    );
}
