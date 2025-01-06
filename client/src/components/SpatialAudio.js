import React, { useState, useEffect, useRef } from 'react';
import StemControls from "./StemControls";
import AudioPlayer from './AudioPlayer';


function SpatialAudio({ stems }) {
  const [pannerNodes, setPannerNodes] = useState({});
  const audioContextRef = useRef(null)
  const gainNodes = useRef({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState({});
  const [sources, setSources] = useState({})


    useEffect(() => {
        if (stems && Object.keys(stems).length > 0) {
            loadAudioFiles();
        }
    }, [stems]);

  const loadAudioFiles = async () => {
        if (!stems) return;
    
        if(!audioContextRef.current) {
           audioContextRef.current = new AudioContext()
        }

    const newPannerNodes = {};
    const newGainNodes = {};
    const newAudioBuffers = {};
      const newSources = {}

    for (const stemName in stems) {
        const response = await fetch(`http://localhost:5000/${stems[stemName].replace('/app/server/', '')}`)
        const arrayBuffer = await response.arrayBuffer();

        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        newAudioBuffers[stemName] = audioBuffer
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      
        const panner = audioContextRef.current.createPanner();
      panner.panningModel = 'HRTF'
      
      const gainNode = audioContextRef.current.createGain();
        source.connect(gainNode)
        gainNode.connect(panner);
        panner.connect(audioContextRef.current.destination);

      newPannerNodes[stemName] = panner;
      newGainNodes[stemName] = gainNode
        newSources[stemName] = source;
    }
    setPannerNodes(newPannerNodes);
    gainNodes.current = newGainNodes
      setAudioBuffers(newAudioBuffers)
      setSources(newSources)
  };



  const handlePositionChange = (stemName, x, y, z) => {
    if (pannerNodes[stemName]) {
      pannerNodes[stemName].positionX.value = x;
      pannerNodes[stemName].positionY.value = y;
      pannerNodes[stemName].positionZ.value = z;
    }
  };

    const handleGainChange = (stemName, gainValue) => {
        if (gainNodes.current[stemName]) {
            gainNodes.current[stemName].gain.value = gainValue;
        }
    };

  const handlePlayPause = () => {
    if (!isPlaying) {
        for(const source_name in sources){
            sources[source_name].start()
        }
        setIsPlaying(true);
    }
    else {
        for(const source_name in sources){
            sources[source_name].stop()
            const source = audioContextRef.current.createBufferSource()
            source.buffer = audioBuffers[source_name]
            const gainNode = audioContextRef.current.createGain();
              source.connect(gainNode)
             gainNode.connect(pannerNodes[source_name])

              setSources(prevSources => ({
                ...prevSources,
                [source_name]: source
            }));
        }
        setIsPlaying(false)
    }
  };

  return (
    <div>
        <h1>Spatial Audio</h1>
      <AudioPlayer isPlaying={isPlaying} onPlayPause={handlePlayPause} />
          {Object.keys(stems || {}).map((stemName) => (
          <StemControls
            key={stemName}
            stemName={stemName}
            onPositionChange={handlePositionChange}
              onGainChange={handleGainChange}
          />
        ))}
    </div>
  );
}

export default SpatialAudio;