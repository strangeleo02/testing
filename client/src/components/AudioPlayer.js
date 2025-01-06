import React from "react";

function AudioPlayer({ onPlayPause, isPlaying }) {
    return (
        <div>
            <button onClick={onPlayPause}>
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    )
}

export default AudioPlayer