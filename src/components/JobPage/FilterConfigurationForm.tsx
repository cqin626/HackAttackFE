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
          <strong>Resume Filter Info:</strong> Define conditions to
          automatically filter resumes based on fields and requirements. The LLM
          interpretation provides a summary of the filter condition.
        </div>
      )}

      {conditions.map((condition, index) => (
        <div className="row mb-3 align-items-stretch" key={index}>
          <div className="col-md-4 d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Property name"
              value={condition.field}
              onChange={(e) => handleChange(index, "field", e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Filter condition"
              value={condition.requirement}
              onChange={(e) =>
                handleChange(index, "requirement", e.target.value)
              }
            />
          </div>
          <div className="col-md-3 d-flex">
            <textarea
              className="form-control border-0"
              placeholder="LLM interpretation (readonly)"
              value={condition.interpretedByLLM}
              readOnly
              rows={1}
              style={{
                resize: "none",
                overflow: "hidden",
              }}
              onInput={(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
          </div>
          <div className="col-md-1 d-flex align-items-center">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeCondition(index)}
              title="Remove condition"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mb-4"
        onClick={addCondition}
      >
        + Add Filter
      </button>
    </div>
  );
};

export default FilterConfigurationForm;
