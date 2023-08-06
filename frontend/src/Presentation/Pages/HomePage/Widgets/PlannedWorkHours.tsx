import {Paper, Stack} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import "chart.js/auto";
import dateFormat from "dateformat";
import {useCallback, useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {DashboardPageProps} from "../HomePage";

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        backgroundColor: string;
        borderColor: string;
    }[];
}

export default function PlannedWorkHours(props: DashboardPageProps) {
    const {t} = useTranslation();
    const [filterInterval, setFilterInterval] = useState("7");
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [],
    });
    const handleChange = (event: SelectChangeEvent) => {
        setFilterInterval(event.target.value);
    };
    const calculateChartData = useCallback(() => {
        const filteredWorkSessions = props.workSessions.filter(
            (session) =>
                new Date(session.date).getTime() <
                new Date().getTime() + parseInt(filterInterval) * 24 * 60 * 60 * 1000
        );
        let dateToWorkHoursMaps: Record<string, number> = {};
        filteredWorkSessions.forEach((session) => {
            let date = dateFormat(new Date(session.date), "yyyy-mm-dd");
            if (dateToWorkHoursMaps[date]) {
                dateToWorkHoursMaps[date] += session.duration;
            } else {
                dateToWorkHoursMaps[date] = session.duration;
            }
        });
        const chartData = {
            labels: Object.keys(dateToWorkHoursMaps).sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateA.getTime() - dateB.getTime();
            }),
            datasets: [
                {
                    label: t("dashboard.widgets.plannedWorkHours.chartLabel"),
                    data: Object.values(dateToWorkHoursMaps),
                    fill: false,
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgba(75, 192, 192, 0.2)",
                },
            ],
        };
        setChartData(chartData);
    }, [filterInterval, props.workSessions, t]);
    useEffect(
        () => calculateChartData(),
        [props.workSessions, filterInterval, calculateChartData]
    );
    return (
        <Paper elevation={4} sx={{padding: "10px"}}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <h3>{t("dashboard.widgets.plannedWorkHours.title")}</h3>
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
            <Line data={chartData}/>
        </Paper>
    );
}
