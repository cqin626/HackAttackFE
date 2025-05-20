import type { CandidateType } from "../../types/types";
import Button from "../Button";
import CandidateCard from "./CandidateCard";

interface Props {
  column: string;
  buttonText: string;
  onButtonClick: () => void;
  candidates: CandidateType[];
}

const ColumnContainer = ({ column, buttonText, onButtonClick, candidates }: Props) => {
  return (
    <div className="card flex-fill text-center shadow-sm" style={{ minWidth: '180px' }}>
      {/* Column Title */}
      <div className="card-header bg-light fw-bold">{column}</div>

      {/* Candidate List */}
      <div className="card-body text-muted">{
        candidates.map(candidate => (
          <CandidateCard candidates={candidate}></CandidateCard>
        ))
      }</div>

      {/* Button */}
      <div className="my-2">
        <Button text={buttonText} onClick={onButtonClick} />
      </div>
    </div>
  );
};


export default ColumnContainer
