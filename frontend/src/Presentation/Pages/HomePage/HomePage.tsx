import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {WorkSession} from "../../../Data/schemas";
import {TasksViewProps} from "../../CommonView";
import DueInWidget from "./Widgets/DueIn";
import PlannedWorkHours from "./Widgets/PlannedWorkHours";
import TodaysPlanWidget from "./Widgets/TodaysPlan";
import QuoteWidget from "./Widgets/Quote";
import {useTranslation} from "react-i18next";

export interface DashboardPageProps extends TasksViewProps {
    workSessions: WorkSession[];
}

export default function HomePage(props: DashboardPageProps) {
    const {t} = useTranslation();
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{marginBottom: "10px"}}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{fontWeight: "bold"}}
                    noWrap
                >
                    {t("dashboard.title")}
                </Typography>
            </Stack>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                spacing={2}
                columns={{xs: 4, md: 8}}
            >
                <Grid item xs={4}>
                    <Stack spacing={2}>
                        <TodaysPlanWidget {...props} />
                        <DueInWidget {...props} />
                    </Stack>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2}>
                        <QuoteWidget/>
                        <PlannedWorkHours {...props} />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
