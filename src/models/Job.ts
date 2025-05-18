export interface Job {
  _id: string;
  title: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'Open' | 'Closed' | 'Paused';
  createdAt: string;  
}
