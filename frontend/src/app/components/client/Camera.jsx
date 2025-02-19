"use client";

import React, { useState, useRef, useEffect } from "react";

function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!showCamera) {
      // Clean up stream when camera is closed
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    async function enableStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error accessing media devices", error);
      }
    }

    enableStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]); // Now depends on showCamera state

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl text-center text-gray-950 font-semibold">
          Card Scanner v1
        </h1>

        <button
          className="mt-6 mb-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => setShowCamera(!showCamera)} // Toggle camera
        >
          {showCamera ? "Close Camera" : "Open Camera"}
        </button>

        {showCamera && (
          <div>
            <video ref={videoRef} autoPlay muted />
            {stream && <p>Camera access granted!</p>}
            {!stream && <p>Waiting for camera access...</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default Camera;
