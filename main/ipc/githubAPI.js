import axios from "axios";
import { config } from "dotenv";

config();

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
  ipcMain.handle("create-github-issue", async (event, { GITHUB_REPO, title, body }) => {
    try {
      console.log(GITHUB_REPO)
      const [owner, repo] = GITHUB_REPO.split("/");
      const token = process.env.GITHUB_TOKEN;
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          title,
          body,
        },
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating GitHub issue:", error);
      return { error: "Error creating GitHub issue" };
    }
  });
}