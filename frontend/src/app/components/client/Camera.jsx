"use client";

import React, { useState, useRef, useEffect } from "react";

function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const capturePhoto = () => {
    if (videoRef.current && stream) {
      // Create canvas if it doesn't exist
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL
      const imageDataURL = canvas.toDataURL("image/png");
      setCapturedImage(imageDataURL);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl text-center text-gray-950 font-semibold">
          Card Scanner v1
        </h1>

        <button
          className="mt-6 mb-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setShowCamera(!showCamera);
            setCapturedImage(null); // Reset captured image when toggling camera
          }}
        >
          {showCamera ? "Close Camera" : "Open Camera"}
        </button>

        {showCamera && (
          <div className="space-y-4">
            <video ref={videoRef} autoPlay muted className="w-full rounded" />
            <canvas ref={canvasRef} className="hidden" />{" "}
            {/* Hidden canvas for capturing */}
            {stream && (
              <button
                onClick={capturePhoto}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Capture Photo
              </button>
            )}
            {!stream && <p>Waiting for camera access...</p>}
          </div>
        )}

        {capturedImage && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Captured Photo:</h2>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Camera;
