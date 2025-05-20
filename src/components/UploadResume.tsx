import React, { useState, useRef } from "react";
import axios from "axios";

const UploadResume: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      await axios.post("http://localhost:8080/api/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(true);
      setFiles([]); // reset file list state

      // Reset the file input's value to clear the "chosen files" UI
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="upload-area mb-3">
        <label 
          htmlFor="file-upload" 
          className={`d-flex flex-column align-items-center justify-content-center p-4 border-2 border-dashed rounded-3 ${files.length > 0 ? 'border-primary bg-light' : 'border-secondary'}`}
          style={{ cursor: "pointer" }}
        >
          <i className={`bi ${files.length > 0 ? 'bi-file-earmark-check text-primary' : 'bi-cloud-arrow-up text-secondary'} fs-1 mb-2`}></i>
          <span className="text-center">
            {files.length > 0 
              ? `${files.length} file${files.length > 1 ? 's' : ''} selected` 
              : 'Drag & drop your resume here or click to browse'}
          </span>
          <small className="text-muted mt-1">Accepts PDF files only</small>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          className="d-none"
          ref={fileInputRef}
        />
      </div>

      {files.length > 0 && (
        <div className="selected-files mb-3">
          <div className="list-group">
            {files.map((file, idx) => (
              <div key={idx} className="list-group-item list-group-item-action d-flex align-items-center border-0 bg-light py-2 px-3 rounded mb-1">
                <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                <span className="text-truncate">{file.name}</span>
                <small className="ms-auto text-muted">
                  {(file.size / 1024).toFixed(0)} KB
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="alert alert-success py-2 d-flex align-items-center" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <span>Resume uploaded successfully!</span>
        </div>
      )}

      <button 
        className="btn btn-primary w-100 d-flex align-items-center justify-content-center" 
        onClick={handleUpload}
        disabled={files.length === 0 || isUploading}
      >
        {isUploading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Uploading...
          </>
        ) : (
          <>
            <i className="bi bi-upload me-2"></i>
            Upload Resume
          </>
        )}
      </button>
    </div>
  );
};

export default UploadResume;