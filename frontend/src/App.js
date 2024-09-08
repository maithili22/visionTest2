
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';


const App= () => {
  const [files, setFiles] = useState([]);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleGenerateTestCases = async () => {
    
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('context', context);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/generate-testcases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true 
      });

      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating test cases:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Automated Testing Instructions Generator</h1>
      <p className="subtitle">
        Upload a screenshot of a digital product's feature and provide context to generate detailed test cases.
      </p>
      <div className="uploadSection">
        <label className="uploadLabel">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="fileInput"
            accept="image/png, image/jpeg"
          />
          <div className="uploadBox">
            <p>Drag and drop files here</p>
            <p className="fileFormatText">Limit 200MB per file • PNG, JPG, JPEG</p>
          </div>
        </label>
        <div className="fileList">
          {files.map((file, index) => (
            <div key={index} className="fileItem">
              <p>{file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</p>
              <button onClick={() => removeFile(index)} className="removeFileButton">X</button>
            </div>
          ))}
        </div>
      </div>
      <input
        className="textarea"
        placeholder="Optional context for the LLM"
        value={context}
        onChange={handleContextChange}
      />
      <button className="describeButton" onClick={handleGenerateTestCases} disabled={loading}>
        {loading ? 'Generating...' : 'Describe Testing Instructions'}
      </button>

      <div>
        {results.map((result, index) => (
          <div key={index}>
            <h3>Image {index + 1}: {result.filename}</h3>
            <p><strong>Description:</strong> {result.description}</p>
            <p><strong>Test Cases:</strong> {result.test_cases}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
