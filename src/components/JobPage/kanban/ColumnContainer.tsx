import React from 'react';
import type { ApplicationType } from '../../../models/Application';
import CandidateCard from './CandidateCard';

interface ColumnContainerProps {
  column: string;
  applications: ApplicationType[];
  buttonText: string;
  onButtonClick: () => void;
  icon?: string;
  color?: string;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
  column,
  applications,
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
          {column} <span className="ms-2 badge bg-white text-dark">{applications.length}</span>
        </h6>
      </div>
      <div className="card-body p-0">
        {applications.length > 0 ? (
          <div className="candidate-list">
            {applications.map(applications => (
              <div 
                key={applications.user._id} 
                className="candidate-card p-3 border-bottom hover-shadow transition-all"
                style={{ cursor: 'pointer' }}
              ><CandidateCard applications={applications}></CandidateCard>
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