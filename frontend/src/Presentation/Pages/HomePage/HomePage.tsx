import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SettingsController } from "../../../Controller/Settings";
import { TasksViewProps } from "../../CommonView";

const settingsCon = new SettingsController();

export default function HomePage(props: TasksViewProps) {
  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  return <Container disableGutters={isMobileScreenSize}></Container>;
}
