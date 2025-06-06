import { useState } from "react";
import type { ResumeFilterCondition } from "../../models/ResumeFilter";

interface FilterConfigurationFormProps {
  conditions: ResumeFilterCondition[];
  setConditions: React.Dispatch<React.SetStateAction<ResumeFilterCondition[]>>;
}

const FilterConfigurationForm: React.FC<FilterConfigurationFormProps> = ({
  conditions,
  setConditions,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleChange = (
    index: number,
    field: keyof ResumeFilterCondition,
    value: string
  ) => {
    const updated = [...conditions];
    updated[index][field] = value;
    setConditions(updated);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: "", requirement: "", interpretedByLLM: "" },
    ]);
  };

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index);
    setConditions(updated);
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-info"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          <i className="bi bi-info-circle me-1"></i>
          Info
        </button>
      </div>

      {showInfo && (
        <div className="alert alert-info p-2 mb-3">
          <strong>Resume Filter Info:</strong>
          Define conditions to automatically filter resumes based on specified
          fields and requirements. The LLM interpretation provides a concise
          explanation justifying any changes made to the filter condition.
        </div>
      )}

      {conditions.map((condition, index) => (
        <div className="row mb-3" key={index} style={{ minHeight: "100px" }}>
          <div className="col-md-3 d-flex flex-column">
            <label className="form-label">Field</label>
            <textarea
              className="form-control auto-resize flex-grow-1"
              value={condition.field}
              onChange={(e) => handleChange(index, "field", e.target.value)}
              rows={3}
              style={{ resize: "vertical", overflowY: "auto" }}
            />
          </div>
          <div className="col-md-3 d-flex flex-column">
            <label className="form-label">Requirement</label>
            <textarea
              className="form-control auto-resize flex-grow-1"
              value={condition.requirement}
              onChange={(e) =>
                handleChange(index, "requirement", e.target.value)
              }
              rows={3}
              style={{ resize: "vertical", overflowY: "auto" }}
            />
          </div>
          <div className="col-md-4 d-flex flex-column">
            <label className="form-label">Justification of Changes</label>
            <textarea
              className="form-control auto-resize flex-grow-1"
              value={condition.interpretedByLLM}
              onChange={(e) =>
                handleChange(index, "interpretedByLLM", e.target.value)
              }
              rows={3}
              style={{ resize: "vertical", overflowY: "auto" }}
            />
          </div>
          <div className="col-md-2 d-flex justify-content-center align-items-center">
            <button
              type="button"
              className="btn btn-sm btn-danger w-100"
              onClick={() => removeCondition(index)}
            >
              <i className="bi bi-x-circle"></i> Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-end mt-3">
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={addCondition}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add Condition
        </button>
      </div>

      <style>{`
        .auto-resize {
          word-wrap: break-word;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default FilterConfigurationForm;
