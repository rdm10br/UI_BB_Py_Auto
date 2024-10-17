import { useEffect, useState } from 'react';

const LogViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logContent, setLogContent] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredContent, setFilteredContent] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      // Replace with your directory path
      const dirPath = '../BB_Py_Automation/Logs/bot/';
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
        .split('\n')
        .filter((line) => line.includes(text))
        .join('\n')
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '20%', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Files</h3>
        <ul style={{height: '75vh', overflow:'auto'}}>
          {files.map((file) => (
            <li
              key={file}
              style={{ cursor: 'pointer', marginBottom: '5px' }}
              onClick={() => handleFileClick(file)}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '80%', padding: '10px' }}>
        <h3>{selectedFile || 'Select a file'}</h3>
        {selectedFile && (
          <>
            <input
              type="text"
              placeholder="Filter log content..."
              value={filterText}
              onChange={handleFilterChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#303030', padding: '10px' , height: '60vh', overflow:'auto'}}>
              {filteredContent}
            </pre>
          </>
        )}
      </div>
    </div>
  );
};

export default LogViewer;