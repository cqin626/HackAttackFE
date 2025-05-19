// src/pages/JobPage.tsx
import React, { useState, useRef } from "react";
import axios from "axios";

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      await axios.post("http://localhost:8080/api/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful");
      setFiles([]); // reset file list state

      // Reset the file input's value to clear the "chosen files" UI
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Your Resume(s)</h2>
      <div className="mb-3">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          className="form-control"
          ref={fileInputRef}  // <-- Add this here
        />

        {files.length > 0 && (
          <div className="mt-2">
            <strong>Selected file{files.length > 1 ? "s" : ""}:</strong>
            <ul className="list-group list-group-flush">
              {files.map((file, idx) => (
                <li key={idx} className="list-group-item p-1">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn btn-primary mt-2" onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
