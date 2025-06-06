export type CandidateType = {
  _id: string;
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
};