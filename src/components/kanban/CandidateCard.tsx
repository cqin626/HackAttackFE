import type { CandidateType } from "../../models/Candidate";

interface Props {
  candidates: CandidateType;
}

const CandidateCard = ({ candidates }: Props) => {
  return (
    <div className="card mb-2 shadow-sm border-0">
      <div className="card-body p-2">
        <h5 className="card-title mb-1">{candidates.name}</h5>
        <h6 className="card-subtitle text-muted mb-2">{candidates.gender}</h6>
        <p className="card-text mb-1">
          <i className="bi bi-envelope-fill me-2"></i>
          {candidates.email}
        </p>
        <p className="card-text text-muted mb-0">
          <small>Applied: {candidates.applicationDate}</small>
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
