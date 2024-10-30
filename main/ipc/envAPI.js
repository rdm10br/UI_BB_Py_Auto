import fs from "fs";
import path from "path";
import Store from "electron-store";

export function initializeEnvAPIHandlers(ipcMain) {
  const isProd = process.env.NODE_ENV === "production";

  // Function to construct the appropriate path for the .env file
  const getEnvFilePath = () => {
    if (isProd) {
      const parentDir = path.dirname(path.dirname(path.dirname(__dirname)));
      return path.join(parentDir, 'scripts', 'BB_Py_Automation', '.env');
    } else {
      return path.join(__dirname, "../scripts/BB_Py_Automation/.env");
    }
  };

  ipcMain.handle("get-env-variables", async (event, envFilePath) => {
    return new Promise((resolve, reject) => {
      const readEnvFile = (filePath) => {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            return reject(`Error reading .env file from ${filePath}`);
          }

          const envVariables = {};
          data.split("\n").forEach((line) => {
            if (line && !line.startsWith("#")) {
              const [key, value] = line.split("=").map((part) => part.trim());
              if (key && value) {
                envVariables[key] = value;
              }
            }
          });

          if (Object.keys(envVariables).length === 0) {
            const alternativePath = path.resolve('../', envFilePath);
            console.warn("No env variables found, trying alternative path:", alternativePath);
            readEnvFile(alternativePath);
          } else {
            resolve(envVariables);
          }
        });
      };

      const resolvedEnvFilePath = getEnvFilePath();
      readEnvFile(resolvedEnvFilePath);
    });
  });

  ipcMain.handle("create-env-file", async (event, envData) => {
    const envFilePath = getEnvFilePath();
    const envContent = Object.entries(envData).map(([key, value]) => `${key}=${value}`).join("\n");

    try {
      fs.writeFileSync(envFilePath, envContent, "utf8");
      return { success: true };
    } catch (error) {
      console.error("Error creating .env file:", error);
      throw new Error("Failed to create .env file");
    }
  });

  ipcMain.handle("delete-env-file", async () => {
    const envFilePath = getEnvFilePath();
    try {
      fs.unlinkSync(envFilePath);
      console.log(".env file deleted");
    } catch (error) {
      console.error("Error deleting env file:", error);
      throw error;
    }
  });
}