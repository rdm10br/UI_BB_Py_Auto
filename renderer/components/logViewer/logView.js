import { useEffect, useState } from "react";
import styles from "./logView.module.css";

const LogViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logContent, setLogContent] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filteredContent, setFilteredContent] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      // Replace with your directory path
      const dirPath = "../BB_Py_Automation/Logs/bot/";
      const files = await window.api.readDirectory(dirPath);
      setFiles(files);
    };
    loadFiles();
  }, []);

  const handleFileClick = async (fileName) => {
    const filePath = `../BB_Py_Automation/Logs/bot/${fileName}`;
    const content = await window.api.readLogFile(filePath);
    setSelectedFile(fileName);
    setLogContent(content);
    setFilteredContent(content);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
    setFilteredContent(
      logContent
        .split("\n")
        .filter((line) => line.includes(text))
        .join("\n")
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.fileList}>
        <h3 className={styles.fileListTitle}>Files</h3>
        <ul className={styles.fileListItems}>
          {files.map((file) => (
            <li
              key={file}
              className={styles.fileListItem}
              onClick={() => handleFileClick(file)}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.logContent}>
        <h3 className={styles.logContentTitle}>
          {selectedFile || "Select a file"}
        </h3>
        {selectedFile && (
          <>
            <input
              type="text"
              placeholder="Filter log content..."
              value={filterText}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <pre className={styles.logDisplay}>
              {filteredContent}
            </pre>
          </>
        )}
      </div>
    </div>
  );
};

export default LogViewer;