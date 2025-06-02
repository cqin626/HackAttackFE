import ReactTimeago from 'react-timeago';
import type { ApplicationType } from "../../../models/Application";

interface Props {
  applications: ApplicationType;
}

const CandidateCard = ({ applications }: Props) => {
  const date = new Date(applications.appliedAt);

  const candidate = applications.applicant;
  
  // Get latest education and work experience
  const latestEducation = candidate.education?.[candidate.education.length - 1];
  const latestWork = candidate.workExperience?.[candidate.workExperience.length - 1];

  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body p-3">
        {/* Header with name, email and status */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center">
           
            <div>
              <h6 className="card-title mb-1 fw-semibold">{candidate.name}</h6>
              <small className="text-muted">{candidate.email}</small>
            </div>
          </div>
        </div>

        {/* Personal Info Row */}
        <div className="row g-2 mb-2 small">
          <div className="col-6">
            <span className="ms-1">{candidate.gender}</span>
          </div>
          <div className="col-6">
            <span className="text-muted">Applied:</span>
            <span className="ms-1"><ReactTimeago date={date} /></span>
          </div>
        </div>

        {/* Latest Education */}
        {latestEducation && (
          <div className="mb-2">
            <div className="bg-light rounded p-2">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-mortarboard me-2 text-primary"></i>
                <small className="fw-medium">{latestEducation.degree} in {latestEducation.fieldOfStudy}</small>
              </div>
              <small className="text-muted">{latestEducation.institution}</small>
            </div>
          </div>
        )}

        {/* Latest Work Experience */}
        {latestWork && (
          <div className="mb-2">
            <div className="bg-light rounded p-2">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-briefcase me-2 text-success"></i>
                <small className="fw-medium">{latestWork.jobTitle}</small>
              </div>
              <small className="text-muted">{latestWork.company}</small>
            </div>
          </div>
        )}

        {/* Languages */}
        {candidate.languages && candidate.languages.length > 0 && (
          <div className="mb-2">
            <div className="d-flex align-items-center gap-1 flex-wrap">
              <i className="bi bi-translate me-1 text-info"></i>
              {candidate.languages.map((lang, idx) => (
                <span key={idx} className="badge bg-info bg-opacity-25 text-info small">
                  {lang.language} ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills and Resume Link */}
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
          <div className="ms-auto d-flex gap-2">
            <a href={candidate.resumeUrl} className="btn btn-sm btn-link p-0 text-decoration-none" target="_blank" rel="noreferrer">
              <i className="bi bi-file-earmark-text"></i>
            </a>
            <button className="btn btn-sm btn-outline-primary">
              <i className="bi bi-eye me-1"></i>
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
