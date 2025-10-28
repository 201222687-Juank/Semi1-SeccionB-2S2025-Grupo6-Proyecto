import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LenguajeContext';
import './ImageSearch.css';

const ImageSearch = ({ onImageUpload, onCameraCapture, loading }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const { t } = useLanguage();

  // Manejar subida de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  // Activar cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de permitir el acceso.');
    }
  };

  // Tomar foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      canvasRef.current.toBlob((blob) => {
        onCameraCapture(blob);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  // Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Abrir selector de archivos
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-search">
      <div className="image-search-options">
        {/* Subir archivo */}
        <div className="option-card" onClick={handleUploadClick}>
          <div className="option-icon">📁</div>
          <div className="option-text">
            <h3>{t('imageSearch.upload')}</h3>
            <p>{t('imageSearch.uploadDesc')}</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Usar cámara */}
        <div 
          className="option-card" 
          onClick={cameraActive ? stopCamera : startCamera}
        >
          <div className="option-icon">📷</div>
          <div className="option-text">
            <h3>{cameraActive ? t('imageSearch.cancelCamera') : t('imageSearch.camera')}</h3>
            <p>{t('imageSearch.cameraDesc')}</p>
          </div>
        </div>
      </div>

      {/* Vista de cámara */}
      {cameraActive && (
        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />
          <button 
            className="capture-button"
            onClick={capturePhoto}
          >
            {t('imageSearch.capture')}
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="image-search-loading">
          <div className="loading-spinner"></div>
          <p>{t('imageSearch.analyzing')}</p>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;