import type { ApplicationType } from "../models/Application";

export function getApplicantsByStatus(
  applications: ApplicationType[],
  status: string
) {
  const filtered = applications.filter((app) => app.status === status);
  const applicantIDs = filtered.map((app) => app.applicant._id);

  return applicantIDs;
}

export function getJobApplicantsJSON(applicantIDs: string[], jobID: string) {
  return {
    jobID: jobID,
    applicants: applicantIDs,
  };
}
