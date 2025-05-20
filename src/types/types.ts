export interface CreateJobType {
  title: string;
  employmentType: string;
  description: string;
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  },
  status: string;
};

export type CandidateType = {
  id: string;
  name: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
  workExperience: {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }[];
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  resumeUrl: string;
  positionApplied: string;
  applicationDate: string;
  status: string;
};