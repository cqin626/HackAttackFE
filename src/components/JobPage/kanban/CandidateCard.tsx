import ReactTimeago from 'react-timeago';
import type { ApplicationType } from "../../../models/Application";

interface Props {
  applications: ApplicationType;
}

const CandidateCard = ({ applications }: Props) => {
  const date = new Date(applications.appliedAt);
  return (
    <div className="card mb-2 shadow-sm border-0">
      <div className="card-body p-2">
        <h5 className="card-title mb-1">{applications.user.email}</h5>
        <p className="card-text text-muted mb-0">
          <small>Applied <ReactTimeago date={date} /></small>
        </p>
      </div>
    </div>
  );
};

export default CandidateCard;
