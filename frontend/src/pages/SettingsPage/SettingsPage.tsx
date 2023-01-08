import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { isLoggedIn } from "../../components/storage/Accounts";
import {
  getServerAddress,
  getStorageBackend,
  setServerAddress,
  testServerConnection,
} from "../../components/storage/StorageBackend";
import ConfirmDialog from "../../components/userInterface/dialog/ConfirmDialog";
import ConfirmReadFileDialog from "../../components/userInterface/dialog/ConfirmReadFileDialog";
import LicenseDialog from "../../components/userInterface/dialog/LicenseDialog";
import SingleTextInputDialog from "../../components/userInterface/dialog/SingleTextInputDialog";

interface SettingsPageProps {
  showUser(visibility: boolean): any;
}

export default function SettingsPage(props: SettingsPageProps) {
  const [dialogVisibility, setDialogVisibility] = useState({
    importJSONData: false,
    exportJSONData: false,
    cleanupCompleted: false,
    deleteAllData: false,
    syncServerIPAddr: false,
    licenseDialog: false,
  });
  const [syncOptionEnabled, setSyncOptionEnabled] = useState(
    getStorageBackend().isSyncEnabled()
  );
  const updateVisibility = (item: string, visibility: boolean) => {
    setDialogVisibility({
      ...dialogVisibility,
      [item]: visibility,
    });
  };
  const [syncServerIPAddr, setSyncServerIPAddr] = useState(getServerAddress());
  const handleSetSyncServerIPAddr = (addr: string) => {
    setSyncServerIPAddr(addr);
    setServerAddress(addr);
  };
  const handleSyncOptionChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSyncOptionEnabled(e.target.checked);
    getStorageBackend().setIsSyncEnabled(e.target.checked);
    props.showUser(e.target.checked);
  };
  return (
    <Container>
      <Grid container spacing={2} columns={{ xs: 6, sm: 12, md: 12 }}>
        <Grid item xs={6}>
          <h2>Managing App Data</h2>
          <List sx={{ width: "100%" }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  updateVisibility("importJSONData", true);
                }}
              >
                <ListItemIcon>
                  <FileDownloadOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Import Data From JSON File" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  updateVisibility("exportJSONData", true);
                }}
              >
                <ListItemIcon>
                  <FileUploadOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Export App Data To JSON File" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  updateVisibility("cleanupCompleted", true);
                }}
              >
                <ListItemIcon>
                  <CleaningServicesOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Cleanup All Completed Tasks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  updateVisibility("deleteAllData", true);
                }}
              >
                <ListItemIcon>
                  <DeleteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Delete All Data" />
              </ListItemButton>
            </ListItem>
          </List>
          <h2>About The App</h2>
          <List sx={{ width: "100%" }}>
            <ListItem>
              <ListItemIcon>
                <InfoOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="App Version" secondary="0.2.0" />
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  updateVisibility("licenseDialog", true);
                }}
              >
                <ListItemIcon>
                  <DescriptionOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="License" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  window.open("https://github.com/bench352/prior2do");
                }}
              >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary="Project GitHub Repository" />
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6}>
          <h2>Prior2Do Sync</h2>
          <Alert severity="info">
            <AlertTitle>Self-hosting needed for Prior2Do Sync</AlertTitle>
            In order to enjoy the backup and sync feature, you need to{" "}
            <strong>host your own Prior2Do Sync server</strong> and configure
            the app to connect to it. You can still use the app standalone if
            you do not have or cannot host your own Prior2Do Sync server.
          </Alert>
          <List sx={{ width: "100%" }}>
            <ListItem>
              <ListItemIcon>
                <CloudSyncIcon />
              </ListItemIcon>
              <ListItemText primary="Enable Prior2Do Sync" />
              <Switch
                edge="end"
                checked={syncOptionEnabled}
                onChange={handleSyncOptionChanges}
              />
            </ListItem>
            {syncOptionEnabled ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      updateVisibility("syncServerIPAddr", true);
                    }}
                  >
                    <ListItemIcon>
                      <DnsOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Server IP Address"
                      secondary={syncServerIPAddr}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={async () => {
                      await testServerConnection();
                    }}
                  >
                    <ListItemIcon>
                      <SyncAltOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Test Connection" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              ""
            )}
          </List>
        </Grid>
      </Grid>

      <ConfirmReadFileDialog
        open={dialogVisibility.importJSONData}
        title="Confirm Import Data?"
        message={
          isLoggedIn()
            ? "Existing data stored locally in the app will be erased and replaced by data from the JSON file. The update will be reflected on the Prior2Do Sync server upon the next connection to the server. Do you confirm importing data from a JSON file?"
            : "Existing data in the app will be erased and replaced by data from the JSON file. Do you confirm importing data from a JSON file?"
        }
        handleClose={() => {
          updateVisibility("importJSONData", false);
        }}
      />
      <ConfirmDialog
        open={dialogVisibility.exportJSONData}
        confirmAction={() => {
          getStorageBackend().exportDataToJson();
        }}
        title="Confirm Export Data?"
        message={
          isLoggedIn()
            ? "Only task data stored locally in the app will be exported as a JSON file. Please make sure you fetch the latest task data from the Prior2Do server before exporting the data from the app. Do you confirm doing so?"
            : "Existing task data stored in the app will be exported as a JSON file. Do you confirm doing so?"
        }
        handleClose={() => {
          updateVisibility("exportJSONData", false);
        }}
      />
      <ConfirmDialog
        open={dialogVisibility.cleanupCompleted}
        confirmAction={() => {
          getStorageBackend().cleanupCompleted();
        }}
        title="Confirm Cleanup All Completed Tasks?"
        message={
          isLoggedIn()
            ? 'All tasks stored locally in the app marked as "completed" will be deleted and cannot be recovered. The update will be reflected on the Prior2Do Sync server upon the next connection to the server. Do you confirm doing so?'
            : 'All tasks that are marked as "completed" will be deleted and cannot be recovered. Do you confirm doing so?'
        }
        handleClose={() => {
          updateVisibility("cleanupCompleted", false);
        }}
      />
      <ConfirmDialog
        open={dialogVisibility.deleteAllData}
        confirmAction={() => {
          localStorage.clear();
          window.location.reload();
        }}
        title="Confirm Delete All Data?"
        message="EVERYTHING IN THE APP WILL BE DELETED AND CANNOT BE RECOVERED. The app would be reset to its initial state. Do you confirm doing so?"
        handleClose={() => {
          updateVisibility("deleteAllData", false);
        }}
      />
      <SingleTextInputDialog
        open={dialogVisibility.syncServerIPAddr}
        setConfirmValue={handleSetSyncServerIPAddr}
        title="Set Server IP Address"
        message="Please enter an IP address/domain that allows you to access your server EXTERNALLY. Please specify the port (e.g. 192.168.1.101:8080) if your server is not serving at the default HTTP port."
        handleClose={() => {
          updateVisibility("syncServerIPAddr", false);
        }}
      />
      <LicenseDialog
        open={dialogVisibility.licenseDialog}
        handleHideDialog={() => {
          updateVisibility("licenseDialog", false);
        }}
      />
    </Container>
  );
}
