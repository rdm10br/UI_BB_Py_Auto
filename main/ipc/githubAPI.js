import axios from "axios";

export function initializeGitHubAPIHandlers(ipcMain) {
  ipcMain.handle("get-github-repo", async (event, GITHUB_REPO) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest release:", error);
      return { error: "Error fetching latest release" };
    }
  });
}