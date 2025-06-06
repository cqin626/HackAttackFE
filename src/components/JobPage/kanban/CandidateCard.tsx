import ReactTimeago from 'react-timeago';
import type { ApplicationType } from "../../../models/Application";

interface Props {
  applications: ApplicationType;
  isVerified?: boolean;
}

const CandidateCard = ({ applications, isVerified = false }: Props) => {
  const date = new Date(applications.appliedAt);
  const candidate = applications.applicant;

  const latestEducation = candidate.education?.[candidate.education.length - 1];
  const latestWork = candidate.workExperience?.[candidate.workExperience.length - 1];

  // Simplified view for verified column
  if (isVerified) {
    return (
      <div className="card mb-3 border-0 shadow-sm">
        <div className="card-body p-3">
          {/* Header with name and email */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1">
                <div className="me-2">
                  <h6 className="card-title mb-0 fw-bold">
                    {candidate.name}
                  </h6>
                  <small className="text-muted">{candidate.email}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Gender and Applied Date vertically */}
          <div className="mb-3">
            <small className="text-muted d-block">
              {candidate.gender}
            </small>
            <small className="text-muted d-block">
              Applied: <ReactTimeago date={date} />
            </small>
          </div>

          {/* Latest Work Experience */}
          {latestWork && (
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <i className="bi bi-briefcase text-primary"></i>
                </div>
                <div className="flex-grow-1">
                  <small className="fw-semibold d-block">
                    {latestWork.jobTitle}
                  </small>
                  <small className="text-muted">{latestWork.company}</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed view for other columns
  return (
    <div className="card mb-3 border-0 shadow-sm">
      <div className="card-body p-3">
        {/* Header with name and email */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <div className="me-2">
                <h6 className="card-title mb-0 fw-bold">
                  {candidate.name}
                </h6>
                <small className="text-muted">{candidate.email}</small>
              </div>
            </div>
          </div>
        </div>

        {/* Gender and Applied Date vertically */}
        <div className="mb-3">
          <small className="text-muted d-block">
            {candidate.gender}
          </small>
          <small className="text-muted d-block">
            Applied: <ReactTimeago date={date} />
          </small>
        </div>

        {/* Latest Education */}
        {latestEducation && (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <div className="me-2">
                <i className="bi bi-mortarboard text-info"></i>
              </div>
              <div className="flex-grow-1">
                <small className="fw-semibold d-block">
                  {latestEducation.degree} in {latestEducation.fieldOfStudy}
                </small>
                <small className="text-muted">{latestEducation.institution}</small>
              </div>
            </div>
          </div>
        )}

        {/* Latest Work Experience */}
        {latestWork && (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <div className="me-2">
                <i className="bi bi-briefcase text-primary"></i>
              </div>
              <div className="flex-grow-1">
                <small className="fw-semibold d-block">
                  {latestWork.jobTitle}
                </small>
                <small className="text-muted">{latestWork.company}</small>
              </div>
            </div>
          </div>
        )}

        {/* Languages */}
        {candidate.languages && candidate.languages.length > 0 && (
          <div className="mb-3">
            <div className="d-flex align-items-center flex-wrap">
              <i className="bi bi-translate text-secondary me-2"></i>
              {candidate.languages.map((lang, idx) => (
                <small key={idx} className="badge bg-light text-dark me-1 mb-1">
                  {lang.language} ({lang.proficiency})
                </small>
              ))}
            </div>
          </div>
        )}

        {/* Skills only (no View button) */}
        <div className="d-flex flex-wrap">
          {candidate.skills.slice(0, 3).map((skill, idx) => (
            <small key={idx} className="badge bg-primary me-1 mb-1">
              {skill}
            </small>
          ))}
          {candidate.skills.length > 3 && (
            <small className="badge bg-secondary">
              +{candidate.skills.length - 3}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
