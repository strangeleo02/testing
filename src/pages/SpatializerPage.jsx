import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StemControls from '../components/StemControls';
import AudioControls from '../components/AudioControls';
import { range } from 'lodash';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playSound = async (file, pan, gain, yPosition, audioRef) => {
    if (!file) return;

    const source = audioContext.createBufferSource();
    const panner = audioContext.createPanner();
    const gainNode = audioContext.createGain();

    panner.panningModel = 'HRTF';
    panner.distanceModel = 'linear';
    panner.refDistance = 1;
    panner.maxDistance = 10;
    panner.rolloffFactor = 1.5;
    panner.positionY.value = yPosition

    const audioBuffer = await audioContext.decodeAudioData(await (await fetch(file)).arrayBuffer());
    source.buffer = audioBuffer;

    source.connect(gainNode)
    gainNode.connect(panner);
    panner.connect(audioContext.destination);

    source.loop = true;
    source.start();
    audioRef.current = {
        source,
        panner,
        gainNode
    }

    return audioRef.current
}


function SpatializerPage() {
  const location = useLocation();
  const [audioNodes, setAudioNodes] = useState({});
  const [initialLoad, setInitialLoad] = useState(false)
  const files = location.state?.files;
  const audioRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const panPositions = [
    [-2, 0, 0],
    [2, 0, 0],
    [0, 0, -2],
    [0, 0, 2]
  ];

  if (files && !initialLoad) {
    files.map((file, index) => {
        const stemAudioRef = audioRefs[index]
        const pos = panPositions[index]
        playSound(file, pos[0], .2, pos[2], stemAudioRef).then((audioNode) => {
          setAudioNodes(prev => ({ ...prev, [index]: { panner: audioNode.panner, gainNode: audioNode.gainNode }}))
        })
    })

    setInitialLoad(true)
  }


  const handlePanChange = (stemIndex, panX, panY) => {
      if(audioNodes[stemIndex] && audioNodes[stemIndex].panner) {
          const panner = audioNodes[stemIndex].panner
          panner.positionX.value = panX
          panner.positionZ.value = panY
      }
  };


  const handleVolumeChange = (stemIndex, volume) => {
      if(audioNodes[stemIndex] && audioNodes[stemIndex].gainNode) {
          const gainNode = audioNodes[stemIndex].gainNode
          gainNode.gain.value = volume
      }
  };

  const handleElevationChange = (stemIndex, elevation) => {
    if(audioNodes[stemIndex] && audioNodes[stemIndex].panner) {
        const panner = audioNodes[stemIndex].panner
        panner.positionY.value = elevation
    }
  };

  return (
    <div>
      <h1>Spatial Audio Controls</h1>
        <div style={{ height: "400px", width: "400px", marginBottom: "20px", border: 'solid 1px #000' }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                    {range(0,4).map(i =>
                      <mesh key={i} position={panPositions[i]}>
                        <sphereGeometry args={[.3, 32, 32]} />
                        <meshBasicMaterial color="lightblue" />
                      </mesh>
                    )}
                <OrbitControls />
          </Canvas>
        </div>

        {files &&
            files.map((file, index) => (
                <StemControls
                key={index}
                stemIndex={index}
                onPanChange={handlePanChange}
                onVolumeChange={handleVolumeChange}
                onElevationChange={handleElevationChange}
                />
            ))
        }
      <AudioControls/>
    </div>
  );
}

export default SpatializerPage;