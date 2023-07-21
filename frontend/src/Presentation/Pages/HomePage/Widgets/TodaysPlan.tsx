import { Paper } from "@mui/material";
import dateFormat from "dateformat";
import WorkSessionCard from "../../../Components/cards/WorkSessionCard";
import { DashboardPageProps } from "../HomePage";
import EmptyListMessage from "./Empty";

import { useTranslation } from "react-i18next";
export default function TodaysPlanWidget(props: DashboardPageProps) {
  const { t } = useTranslation();
  return (
    <Paper elevation={4} sx={{ padding: "10px" }}>
      <h3>{t("dashboard.widgets.todaysPlan.title")}</h3>
      {props.workSessions.filter(
        (session) =>
          dateFormat(new Date(session.date), "yyyy-mm-dd") ===
          dateFormat(new Date(), "yyyy-mm-dd")
      ).length > 0 ? (
        props.workSessions
          .filter(
            (session) =>
              dateFormat(new Date(session.date), "yyyy-mm-dd") ===
              dateFormat(new Date(), "yyyy-mm-dd")
          )
          .map((session) => (
            <WorkSessionCard
              session={session}
              showPlannedDate={false}
              handleRefreshPage={props.handleRefreshPage}
            />
          ))
      ) : (
        <EmptyListMessage text={t("dashboard.widgets.todaysPlan.noPlans")} />
      )}
    </Paper>
  );
}
