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
