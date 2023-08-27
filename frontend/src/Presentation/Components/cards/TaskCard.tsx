import {CardActionArea, Checkbox} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dateFormat from "dateformat";
import {useEffect, useState} from "react";
import {TagsController} from "../../../Controller/Tags";
import {TasksController} from "../../../Controller/Tasks";
import {Tag, Task} from "../../../Data/schemas";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import EditTaskDialog from "../dialog/tasks/EditTaskDialog";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

interface task {
    task: Task;

    handleRefreshPage(): any;
}

const tasksCon = new TasksController();
const tagsCon = new TagsController();

function TagChip(props: { tagId: string | null }) {
    const [tag, setTag] = useState(null as Tag | null);
    useEffect(() => {
        let tagQue = props.tagId || "";
        tagsCon
            .getTagById(tagQue)
            .then((value) => {
                setTag(value);
            })
            .catch(() => {
                setTag(null);
            });
    }, [props]);
    return tag != null ? (
        <Chip
            icon={<LabelOutlinedIcon fontSize="small"/>}
            size="small"
            label={tag.name}
        />
    ) : (
        <></>
    );
}

export default function TaskCard(props: task) {
    const [taskCompleted, setTaskCompleted] = useState(props.task.completed);
    const [showUpdateTaskDialog, setShowUpdateTaskDialog] = useState(false);
    const handleHideDialog = () => {
        setShowUpdateTaskDialog(false);
    };
    const handleShowDialog = () => {
        setShowUpdateTaskDialog(true);
    };
    const handleCheckboxChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {checked} = e.target;
        setTaskCompleted(checked);
        await tasksCon.updateTask({
            ...props.task,
            completed: checked,
        });
    };
    return (
        <>
            <Card sx={{margin: "5px 0px"}}>
                <CardActionArea
                    sx={{
                        padding: "10px 5px",
                    }}
                    onClick={handleShowDialog}
                >
                    <Grid
                        container
                        direction="row"
                        wrap="nowrap"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item>
                            <Checkbox
                                name="completed"
                                checked={taskCompleted}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onChange={handleCheckboxChange}
                            />
                        </Grid>
                        <Grid item zeroMinWidth>
                            <Typography
                                variant="h6"
                                component="h6"
                                noWrap
                                style={{
                                    textDecoration: taskCompleted ? "line-through" : "none",
                                }}
                            >
                                {props.task.name}
                            </Typography>

                            <Stack direction="row" spacing={1} overflow="auto">
                                {props.task.dueDate !== null ? (
                                    <Chip
                                        icon={<EventOutlinedIcon fontSize="small"/>}
                                        size="small"
                                        label={
                                            dateFormat(Date.now(), "yyyy") ===
                                            dateFormat(props.task.dueDate, "yyyy")
                                                ? dateFormat(props.task.dueDate, "mmm dd")
                                                : dateFormat(props.task.dueDate, "mmm dd, yyyy")
                                        }
                                    />
                                ) : (
                                    ""
                                )}
                                {props.task.estimatedHours > 0 ? (
                                    <Chip
                                        icon={<TimerOutlinedIcon fontSize="small"/>}
                                        size="small"
                                        label={`${props.task.estimatedHours}h`}
                                    />
                                ) : (
                                    ""
                                )}
                                <TagChip tagId={props.task.tagId}/>
                                {props.task.subTasks.length > 0 ? (
                                    <Chip
                                        icon={<CheckCircleOutlineOutlinedIcon fontSize="small"/>}
                                        size="small"
                                        label={`${
                                            props.task.subTasks.filter((subTask) => subTask.completed)
                                                .length
                                        }/${props.task.subTasks.length}`}
                                    />
                                ) : (
                                    ""
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </CardActionArea>
            </Card>
            <EditTaskDialog
                open={showUpdateTaskDialog}
                handleHideDialog={handleHideDialog}
                handleRefreshPage={props.handleRefreshPage}
                existingTask={props.task}
            />
        </>
    );
}
