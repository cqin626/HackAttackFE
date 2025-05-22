import React from 'react';
import type { CandidateType } from '../../models/Candidate';

interface ColumnContainerProps {
  column: string;
  candidates: CandidateType[];
  buttonText: string;
  onButtonClick: () => void;
  icon?: string;
  color?: string;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  candidates,
  buttonText,
  onButtonClick,
  icon = 'bi-list-check',
  color = 'primary'
}) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className={`card-header bg-${color} bg-opacity-10 d-flex align-items-center justify-content-between py-3`}>
        <h6 className={`text-${color} mb-0 fw-bold d-flex align-items-center`}>
          <i className={`bi ${icon} me-2`}></i>
          {column} <span className="ms-2 badge bg-white text-dark">{candidates.length}</span>
        </h6>
      </div>
      <div className="card-body p-0">
        {candidates.length > 0 ? (
          <div className="candidate-list">
            {candidates.map(candidate => (
              <div 
                key={candidate.id} 
                className="candidate-card p-3 border-bottom hover-shadow transition-all"
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between mb-1">
                  <h6 className="mb-0 fw-semibold">{candidate.name}</h6>
                  <small className="text-muted">
                    {new Date(candidate.applicationDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </small>
                </div>
                <p className="text-muted mb-1 small">
                  <i className="bi bi-briefcase me-1"></i>
                  {candidate.positionApplied}
                </p>
                <div className="d-flex align-items-center mt-2">
                  <div className="skills d-flex gap-1 flex-wrap">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-secondary small">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="badge bg-light text-secondary small">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="ms-auto">
                    <a href={candidate.resumeUrl} className="btn btn-sm btn-link p-0 text-decoration-none" target="_blank" rel="noreferrer">
                      <i className="bi bi-file-earmark-text"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center text-center text-muted p-4">
            <i className="bi bi-inbox fs-2 mb-2"></i>
            <p className="mb-0">No candidates in this stage</p>
          </div>
        )}
      </div>
      <div className="card-footer bg-white border-0 p-3">
        <button 
          className={`btn btn-${color} btn-sm d-flex align-items-center justify-content-center w-100`}
          onClick={onButtonClick}
        >
          <i className={`bi ${icon} me-1`}></i>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;