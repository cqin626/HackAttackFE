import { useState } from "react";
import ColumnContainer from "./ColumnContainer";
import type { CandidateType } from "../../types/types";

const KanbanBoard = () => {
  // Mock Candidate Data
  const mockCandidates: CandidateType[] = [
    {
      id: "1",
      name: "Alice Johnson",
      gender: "Female",
      email: "alice.johnson@example.com",
      dateOfBirth: "1995-04-12",
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor's",
          fieldOfStudy: "Computer Science",
          startDate: "2013-08-01",
          endDate: "2017-05-15",
        },
      ],
      workExperience: [
        {
          company: "TechCorp Inc.",
          jobTitle: "Frontend Developer",
          startDate: "2018-01-10",
          endDate: "2021-06-30",
          responsibilities: "Developed React components and collaborated with UX designers.",
        },
      ],
      skills: ["JavaScript", "React", "CSS", "HTML"],
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Intermediate" },
      ],
      resumeUrl: "https://example.com/resumes/alice-johnson.pdf",
      positionApplied: "Frontend Developer",
      applicationDate: "2025-04-15",
      status: "Verified",
    },
    {
      id: "2",
      name: "Brian Kim",
      gender: "Male",
      email: "brian.kim@example.com",
      dateOfBirth: "1990-11-23",
      education: [
        {
          institution: "MIT",
          degree: "Master's",
          fieldOfStudy: "Artificial Intelligence",
          startDate: "2014-09-01",
          endDate: "2016-06-15",
        },
      ],
      workExperience: [
        {
          company: "DataSolve AI",
          jobTitle: "Machine Learning Engineer",
          startDate: "2017-03-01",
          endDate: "2024-12-31",
          responsibilities: "Designed and trained ML models for healthcare applications.",
        },
      ],
      skills: ["Python", "TensorFlow", "Data Analysis", "NLP"],
      languages: [
        { language: "English", proficiency: "Fluent" },
        { language: "Korean", proficiency: "Native" },
      ],
      resumeUrl: "https://example.com/resumes/brian-kim.pdf",
      positionApplied: "ML Engineer",
      applicationDate: "2025-04-18",
      status: "Interview Scheduled",
    },
    {
      id: "3",
      name: "Clara Singh",
      gender: "Female",
      email: "clara.singh@example.com",
      dateOfBirth: "1998-02-05",
      education: [
        {
          institution: "University of Toronto",
          degree: "Bachelor's",
          fieldOfStudy: "Information Technology",
          startDate: "2016-09-01",
          endDate: "2020-06-01",
        },
      ],
      workExperience: [
        {
          company: "WebGen Solutions",
          jobTitle: "Full Stack Developer",
          startDate: "2021-02-01",
          endDate: "Present",
          responsibilities: "Built and maintained web applications using MERN stack.",
        },
      ],
      skills: ["Node.js", "React", "MongoDB", "Express.js"],
      languages: [
        { language: "English", proficiency: "Fluent" },
        { language: "Hindi", proficiency: "Native" },
      ],
      resumeUrl: "https://example.com/resumes/clara-singh.pdf",
      positionApplied: "Full Stack Developer",
      applicationDate: "2025-05-01",
      status: "Verified",
    },
  ];

  const [columns, setColumns] = useState<string[]>(['Applied', 'Screened', 'Verified', 'Interview Scheduled']);
  const [candidates, setCandidates] = useState<CandidateType[]>(mockCandidates);

  const columnConfigs: Record<string, { buttonText: string; onClick: () => void; icon: string; color: string }> = {
    'Applied': {
      buttonText: 'Filter',
      onClick: () => console.log('Filtering Applied Candidates'),
      icon: 'bi-funnel',
      color: 'primary'
    },
    'Screened': {
      buttonText: 'Verify',
      onClick: () => console.log('Viewing Screened Candidates'),
      icon: 'bi-check-circle',
      color: 'info'
    },
    'Verified': {
      buttonText: 'Schedule Interview',
      onClick: () => console.log('Verifying Candidate Info'),
      icon: 'bi-calendar-event',
      color: 'success'
    },
    'Interview Scheduled': {
      buttonText: 'Mark Interviewed',
      onClick: () => console.log('Rescheduling Interview'),
      icon: 'bi-check2-all',
      color: 'warning'
    }
  };

  return (
    <div className="my-5 pb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">
          <i className="bi bi-kanban me-2"></i>
          Application Progress
        </h4>
        <div className="btn-group">
          <button type="button" className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-sort-down me-1"></i>
            Sort
          </button>
          <button type="button" className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-funnel me-1"></i>
            Filter
          </button>
        </div>
      </div>
      
      <div className="kanban-board">
        <div className="row g-3">
          {columns.map(col => (
            <div className="col-md-6 col-lg-3" key={col}>
              <ColumnContainer
                column={col}
                buttonText={columnConfigs[col].buttonText}
                onButtonClick={columnConfigs[col].onClick}
                candidates={candidates.filter(candidate => candidate.status === col)}
                icon={columnConfigs[col].icon}
                color={columnConfigs[col].color}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;