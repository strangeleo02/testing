import React, { useState } from 'react';

function AudioUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setUploading(true);
    setError(null)
    if (!file) {
        setError("Please select an audio file")
        setUploading(false)
        return;
    }


    const formData = new FormData();
    formData.append('audioFile', file);

    try {
        const response = await fetch('http://localhost:5000/separate', {
            method: 'POST',
            body: formData,
        });
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to separate audio");
      }
      const data = await response.json();
      onUploadSuccess(data)
    } catch (err) {
        setError(err.message)
    } finally {
        setUploading(false)
    }
  };

  return (
    <div>
       <h1>Upload Audio File</h1>
      <input type="file" accept=".wav,.mp3" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={uploading}>
        {uploading ? 'Separating...' : 'Separate Stems'}
      </button>
       {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default AudioUploader;