import { useEffect, useState, useCallback } from "react";
import styles from "./logView.module.css";

const LogViewer = ({ dir }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logContent, setLogContent] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filteredContent, setFilteredContent] = useState("");

  // Load files in the specified directory
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const dirPath = `scripts/BB_Py_Automation/Logs/${dir}`;
        const loadedFiles = await window.MainIPC.readDirectory(dirPath);
        setFiles(loadedFiles);
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };
    loadFiles();
  }, [dir]);

  // Formats a single line with highlights and styles
  const formatLogLine = useCallback(
    (line, filter) => {
      let styledLine = line.replace(
        /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/,
        (match, dateTime) =>
          `<span class="${styles.dateTime}">[${dateTime}]</span>`
      );

      styledLine = styledLine.replace(
        /(Execution Start|Logged in successfully!|Start loop|Execution End|Execution time|seconds|Run:|\s\w+\.json|(?<=ID of ).+)/gi,
        (match) => `<span class="${styles.logLevel}">${match}</span>`
      );

      styledLine = styledLine.replace(
        /\b(wrong|Exception occurred|Call log|error)\b/gi,
        (match) => `<span class="${styles.keyword}">${match}</span>`
      );

      styledLine = styledLine.replace(
        /(http[^\s<>"]+)/gi,
        (match) => `<span class="${styles.logLevelLink}">${match}</span>`
      );

      styledLine = styledLine.replace(
        /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] (.+?):/g,
        (match) => `<span class="${styles.logLevel}">${match}:</span>`
      );
      

      if (filter) {
        styledLine = styledLine.replace(
          new RegExp(`(${filter})`, "gi"),
          `<span class="${styles.highlight}">$1</span>`
        );
      }

      return styledLine;
    },
    [styles]
  );

  // Reads and formats log file content
  const handleFileClick = async (fileName) => {
    try {
      const filePath = `scripts/BB_Py_Automation/Logs/${dir}/${fileName}`;
      const content = await window.MainIPC.readLogFile(filePath);
      setSelectedFile(fileName);
      setLogContent(content);

      const formattedContent = content
        .split("\n")
        .map((line) => formatLogLine(line, ""))
        .join("\n");

      setFilteredContent(formattedContent);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  // Filters log content based on user input
  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);

    const highlightedContent = logContent
      .split("\n")
      .filter((line) => !text || line.includes(text))
      .map((line) => formatLogLine(line, text))
      .join("\n");

    setFilteredContent(highlightedContent);
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
            <pre
              className={styles.logDisplay}
              dangerouslySetInnerHTML={{ __html: filteredContent }}
            ></pre>
          </>
        )}
      </div>
    </div>
  );
};

export default LogViewer;