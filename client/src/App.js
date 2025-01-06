import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import SpatialAudio from './components/SpatialAudio';

function App() {
  const [stems, setStems] = useState(null);

    const handleUploadSuccess = (data) => {
        setStems(data);
    }

  return (
    <div className="App">
      {stems === null ? <AudioUploader onUploadSuccess={handleUploadSuccess} /> :
          <SpatialAudio stems={stems} />}
    </div>
  );
}

export default App;