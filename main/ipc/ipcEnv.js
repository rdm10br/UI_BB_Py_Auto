import { handleEnvRead, handleEnvWrite, handleEnvDelete } from "../utils/envUtils";

export const handleEnvFile = (ipcMain) => {
  ipcMain.handle("get-env-variables", async (event, envFilePath) => {
    return handleEnvRead(envFilePath);
  });

  ipcMain.handle("create-env-file", async (event, envData) => {
    return handleEnvWrite(envData);
  });

  ipcMain.handle("delete-env-file", async () => {
    return handleEnvDelete();
  });
};