import InboxIcon from '@mui/icons-material/Inbox';
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

interface EmptyProps {
  text: string;
}

export default function EmptyListMessage(props: EmptyProps) {
  return (
    <Box sx={{ padding: "20px 0px" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <InboxIcon />
        <Typography>{props.text}</Typography>
      </Stack>
    </Box>
  );
}
