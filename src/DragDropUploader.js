import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './DragDropUploader.css';

const DragDropUploader = () => {
  const [deliverableType, setDeliverableType] = useState('');
  const [contributionFile, setContributionFile] = useState(null);
  const [reflectionFile, setReflectionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDropContribution = useCallback(acceptedFiles => {
    setContributionFile(acceptedFiles[0]);
  }, []);

  const onDropReflection = useCallback(acceptedFiles => {
    setReflectionFile(acceptedFiles[0]);
  }, []);

  const { getRootProps: getContributionRootProps, getInputProps: getContributionInputProps } = useDropzone({ onDrop: onDropContribution });
  const { getRootProps: getReflectionRootProps, getInputProps: getReflectionInputProps } = useDropzone({ onDrop: onDropReflection });

  const handleDeliverableTypeChange = (e) => {
    const selectedType = e.target.value;
    setDeliverableType(selectedType);
    console.log('Selected Deliverable Type:', selectedType);
  };
  
  const uploadFiles = async () => {
    if (!deliverableType || !contributionFile || !reflectionFile) {
      alert('Please select deliverable type and both files.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('deliverableType', deliverableType);
    formData.append('contributionFile', contributionFile);
    formData.append('reflectionFile', reflectionFile);

    try {
      await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      alert('Files uploaded and zipped successfully!');
      setContributionFile(null);
      setReflectionFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>Deliverables File Uploader</h1>
      <select 
        value={deliverableType} 
        onChange={handleDeliverableTypeChange}
        className="deliverable-select"
      >
        <option value="">Select Deliverable Type</option>
        <optgroup label="국제표준화">
          <option value="국제표준화-제정-개발">제정-개발</option>
          <option value="국제표준화-제정-승인">제정-승인</option>
          <option value="국제표준화-제정-제안">제정-제안</option>
        </optgroup>
        <optgroup label="사실표준화">
          <option value="사실표준화-제정-개발">제정-개발</option>
          <option value="사실표준화-제정-승인">제정-승인</option>
          <option value="사실표준화-제정-제안">제정-제안</option>
        </optgroup>
      </select>
      
      <div className="dropzone-container">
        <div {...getContributionRootProps()} className={`dropzone ${contributionFile ? 'file-selected' : ''}`}>
          <input {...getContributionInputProps()} />
          {contributionFile ? (
            <>
              <div className="checkmark">✓</div>
              <p className="file-name">{contributionFile.name}</p>
            </>
          ) : (
            <>
              <p>Contribution File</p>
              <p>Drag 'n' drop here, or click to select</p>
            </>
          )}
        </div>

        <div {...getReflectionRootProps()} className={`dropzone ${reflectionFile ? 'file-selected' : ''}`}>
          <input {...getReflectionInputProps()} />
          {reflectionFile ? (
            <>
              <div className="checkmark">✓</div>
              <p className="file-name">{reflectionFile.name}</p>
            </>
          ) : (
            <>
              <p>Reflection File</p>
              <p>Drag 'n' drop here, or click to select</p>
            </>
          )}
        </div>
      </div>

      <button onClick={uploadFiles} disabled={uploading} className="upload-button">
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>

      {uploading && (
        <div className="progress-bar">
          <div className="progress" style={{width: `${uploadProgress}%`}}></div>
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;