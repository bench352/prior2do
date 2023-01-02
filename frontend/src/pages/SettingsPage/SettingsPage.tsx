import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import { useState } from "react";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import ConfirmReadFileDialog from "../../components/userInterface/dialog/ConfirmReadFileDialog";
import ConfirmDialog from "../../components/userInterface/dialog/ConfirmDialog";
import SingleTextInputDialog from "../../components/userInterface/dialog/SingleTextInputDialog";
import {
  getServerAddress,
  setServerAddress,
  testServerConnection,
} from "../../components/storage/StorageBackend";

export default function SettingsPage() {
  const [dialogVisibility, setDialogVisibility] = useState({
    importJSONData: false,
    cleanupCompleted: false,
    deleteAllData: false,
    syncServerIPAddr: false,
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
  };
  return (
    <div>
      <h2>Managing App Data</h2>
      <p>
        Backup/Restore data for the app, cleanup the data, or reset the app.
      </p>
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
              getStorageBackend().exportDataToJson();
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
      <h2>Prior2Do Sync</h2>
      <p>
        If you have your own server or Kubernetes Cluster, you can host an
        instance of Prior2Do Sync server on it and configure your Prior2Do app
        to backup and sync with it.
      </p>
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

      <ConfirmReadFileDialog
        open={dialogVisibility.importJSONData}
        confirmAction={() => {
          alert("Item imported");
        }}
        title="Confirm Import Data?"
        message="Existing data in the app will be erased and replaced by data from the JSON file. Do you confirm importing data from a JSON file?"
        handleClose={() => {
          updateVisibility("importJSONData", false);
        }}
      />
      <ConfirmDialog
        open={dialogVisibility.cleanupCompleted}
        confirmAction={() => {
          getStorageBackend().cleanupCompleted();
        }}
        title="Confirm Cleanup All Completed Tasks?"
        message='All tasks that are marked as "completed" will be deleted and cannot be recovered. Do you confirm doing so?'
        handleClose={() => {
          updateVisibility("cleanupCompleted", false);
        }}
      />
      <ConfirmDialog
        open={dialogVisibility.deleteAllData}
        confirmAction={() => {
          localStorage.clear();
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
    </div>
  );
}
