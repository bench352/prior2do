import {Paper, Stack} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {useState} from "react";
import TaskCard from "../../../Components/cards/TaskCard";
import {DashboardPageProps} from "../HomePage";
import EmptyListMessage from "./Empty";
import {useTranslation} from "react-i18next";

export default function DueInWidget(props: DashboardPageProps) {
    const {t} = useTranslation();
    const [filterInterval, setFilterInterval] = useState("7");
    const handleChange = (event: SelectChangeEvent) => {
        setFilterInterval(event.target.value);
    };
    return (
        <Paper elevation={4} sx={{padding: "10px"}}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <h3>{t("dashboard.widgets.dueIn.title")}</h3>
                <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                    <Select
                        displayEmpty
                        inputProps={{"aria-label": "Without label"}}
                        value={filterInterval}
                        onChange={handleChange}
                    >
                        <MenuItem value="7">{t("dashboard.widgets.select.7d")}</MenuItem>
                        <MenuItem value="14">{t("dashboard.widgets.select.14d")}</MenuItem>
                        <MenuItem value="30">{t("dashboard.widgets.select.30d")}</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            {props.tasks.filter(
                (task) =>
                    task.dueDate !== null &&
                    new Date(task.dueDate).getTime() <
                    new Date().getTime() +
                    parseInt(filterInterval) * 24 * 60 * 60 * 1000
            ).length > 0 ? (
                props.tasks
                    .filter(
                        (task) =>
                            task.dueDate !== null &&
                            new Date(task.dueDate).getTime() <
                            new Date().getTime() +
                            parseInt(filterInterval) * 24 * 60 * 60 * 1000
                    )
                    .map((task) => (
                        <TaskCard task={task} handleRefreshPage={props.handleRefreshPage}/>
                    ))
            ) : (
                <EmptyListMessage
                    text={t("dashboard.widgets.dueIn.noTasks")}
                />
            )}
        </Paper>
    );
}
