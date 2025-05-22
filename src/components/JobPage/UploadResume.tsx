import React, { useState, useRef } from "react";
import axios from "axios";
import config from "../../config";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DISPLAY = 5;

const UploadResume: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validNewFiles: File[] = [];

      selectedFiles.forEach((file) => {
        if (file.type !== "application/pdf") {
          alert(`File "${file.name}" is not a PDF and was skipped.`);
        } else if (file.size > MAX_FILE_SIZE) {
          alert(`File "${file.name}" is larger than 5MB and was skipped.`);
        } else if (files.some((f) => f.name === file.name)) {
          alert(`File "${file.name}" is already added and was skipped.`);
        } else {
          validNewFiles.push(file);
        }
      });

      setFiles((prev) => [...prev, ...validNewFiles]);
      setUploadSuccess(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
      const url = config.API_BASE_URL + "/api/resumes/upload";
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadSuccess(true);
      setFiles([]);
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
          className={`d-flex flex-column align-items-center justify-content-center p-4 border-2 border-dashed rounded-3 ${
            files.length > 0 ? "border-primary bg-light" : "border-secondary"
          }`}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`bi ${
              files.length > 0
                ? "bi-file-earmark-check text-primary"
                : "bi-cloud-arrow-up text-secondary"
            } fs-1 mb-2`}
          ></i>
          <span className="text-center">
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
              : "Drag & drop your resume here or click to browse"}
          </span>
          <small className="text-muted mt-1">
            Accepts PDF files only (max 5MB each)
          </small>
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
        <div
          className="selected-files mb-3"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <div className="list-group">
            {files.slice(0, MAX_DISPLAY).map((file, idx) => (
              <div
                key={idx}
                className="list-group-item list-group-item-action d-flex align-items-center border-0 bg-light py-2 px-3 rounded mb-1"
              >
                <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                <span className="text-truncate flex-grow-1">{file.name}</span>
                <small
                  className="text-muted mx-2"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {(file.size / 1024).toFixed(0)} KB
                </small>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveFile(idx)}
                >
                  &times;
                </button>
              </div>
            ))}
            {files.length > MAX_DISPLAY && (
              <div className="text-muted text-center small">
                +{files.length - MAX_DISPLAY} more
              </div>
            )}
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div
          className="alert alert-success py-2 d-flex align-items-center"
          role="alert"
        >
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
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
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
