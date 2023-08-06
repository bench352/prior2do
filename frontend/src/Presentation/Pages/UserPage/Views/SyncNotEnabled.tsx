import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function SyncNotEnabled() {
    return (
        <Alert severity="warning">
            <AlertTitle>Prior2Do Sync Not Enabled</AlertTitle>
            You have to enable Prior2Do Sync and configure the connection to the
            Prior2Do Sync server in Settings to log in/signup for your Prior2Do
            account.
        </Alert>
    );
}
