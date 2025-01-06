import React, { useState } from 'react';

function UploadForm({ onFileUploaded }) {
  const [file, setFile] = useState(null);
  const [stems, setStems] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/split-stems', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setStems(data.stems);
        onFileUploaded(data.stems)
      } else {
        alert('Error during file processing');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload or process');
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Split</button>
    </div>
  );
}

export default UploadForm;