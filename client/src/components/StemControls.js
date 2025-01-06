import React, {useState} from 'react';

function StemControls({ stemName, onPositionChange, onGainChange}) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
    const [gain, setGain] = useState(1)

    const handlePositionChange = () => {
      onPositionChange(stemName, parseFloat(x), parseFloat(y), parseFloat(z));
  };

  const handleGainChange = () => {
        onGainChange(stemName, parseFloat(gain))
    }

  return (
    <div>
      <h3>{stemName}</h3>
        <div>
        <label>X:</label>
            <input type="number" value={x} onChange={(e) => setX(e.target.value)} onBlur={handlePositionChange}/>
        </div>
        <div>
        <label>Y:</label>
            <input type="number" value={y} onChange={(e) => setY(e.target.value)} onBlur={handlePositionChange}/>
        </div>
        <div>
        <label>Z:</label>
        <input type="number" value={z} onChange={(e) => setZ(e.target.value)} onBlur={handlePositionChange}/>
        </div>
       <div>
        <label>Gain:</label>
        <input type="number" value={gain} onChange={(e) => setGain(e.target.value)} onBlur={handleGainChange} step="0.1" min="0" max="2"/>
        </div>
    </div>
  );
}

export default StemControls;