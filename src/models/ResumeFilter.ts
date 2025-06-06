export interface ResumeFilterCondition {
  field: string;
  requirement: string;
  interpretedByLLM: string;
}

export interface ResumeFilter {
  jobId: string;
  conditions: ResumeFilterCondition[];
}
