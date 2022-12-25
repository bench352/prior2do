import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { getStorageBackend } from "../../components/storage/StorageBackend";
import ConfirmReadFileDialog from "../../components/userInterface/dialog/ConfirmReadFileDialog";
import ConfirmDialog from "../../components/userInterface/dialog/ConfirmDialog";

export default function SettingsPage() {
  const [dialogVisibility, setDialogVisibility] = useState({
    importJSONData: false,
    cleanupCompleted: false,
    deleteAllData: false,
  });
  const updateVisibility = (item: string, visibility: boolean) => {
    setDialogVisibility({
      ...dialogVisibility,
      [item]: visibility,
    });
  };
  return (
    <div>
      <h2>Managing App Data</h2>
      <p>
        Backup/Restore data for the app, cleanup the data, or reset the app.
      </p>
      <List sx={{ width: "100%" }} aria-label="contacts">
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
      <ConfirmReadFileDialog
        open={dialogVisibility.importJSONData}
        confirmAction={() => {
          alert("Item imported");
        }}
        title="Confirm Import Data?"
        message="When you choose to import data, existing data in the app will be erased and replaced by data from the JSON file. Do you confirm importing data from a JSON file?"
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
    </div>
  );
}
