import React, { useState } from 'react';
import { Range } from 'react-range';
import { FaVolumeUp } from 'react-icons/fa';
import { SlArrowUp, SlArrowDown } from 'react-icons/sl';

function StemControls({ stemIndex, onPanChange, onVolumeChange, onElevationChange }) {
    const [panPosition, setPanPosition] = useState({x:0, y: 0})
    const [volume, setVolume] = useState([0.2]);
    const [elevation, setElevation] = useState([0]);

    const handlePanDrag = (e) => {
        const target = e.target
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width/2;
        const centerY = rect.height/2;
        const panX = (x - centerX)/centerX * 5;
        const panY = (y - centerY)/centerY * 5;

        setPanPosition({x: panX, y: panY})
        onPanChange(stemIndex, panX, panY);
    };


    const handleVolumeChange = (values) => {
      setVolume(values);
      onVolumeChange(stemIndex, values[0]);
    };

    const handleElevationChange = (value) => {
        setElevation(value)
        onElevationChange(stemIndex, value[0])
    }


    return (
      <div style={{ marginBottom: "20px" }}>
        <h3>Stem {stemIndex + 1}</h3>
        <div style={{width: '200px', height: "200px", backgroundColor: "grey", borderRadius: "50%", border: 'solid 1px #fff' }} onMouseMove={handlePanDrag}>
            <div style={{ borderRadius: "50%", position: "relative", left: `${(panPosition.x / 5 * 100) + 45}%`, top: `${(panPosition.y / 5 * 100) + 45}%`, width: "10px", height: "10px", backgroundColor: "red" }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: "10px" }}>
          <FaVolumeUp style={{ marginRight: '5px' }} />
          <Range
            values={volume}
            step={0.01}
            min={0}
            max={1}
            onChange={handleVolumeChange}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                    ...props.style,
                    height: '3px',
                    width: '200px',
                    backgroundColor: '#ccc',
                  }}
              >
                {children}
              </div>
            )}
             renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '15px',
                  width: '15px',
                  backgroundColor: '#4285f4',
                  borderRadius: '50%',
                }}
              />
            )}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: "10px" }}>
          <SlArrowUp style={{ marginRight: '5px' }} />
          <Range
                values={elevation}
                step={0.1}
                min={-2}
                max={2}
                onChange={handleElevationChange}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '3px',
                            width: '200px',
                            backgroundColor: '#ccc',
                        }}
                    >
                    {children}
                    </div>
                    )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        style={{
                        ...props.style,
                        height: '15px',
                        width: '15px',
                        backgroundColor: '#4285f4',
                        borderRadius: '50%',
                        }}
                    />
                    )}
                />
            <SlArrowDown style={{ marginRight: '5px' }} />
        </div>
      </div>
    );
  }

export default StemControls;