import type { CandidateType } from "./Candidate";

export type ApplicationType = {
  applicant: CandidateType
  appliedAt: string;
  status: string;
};
