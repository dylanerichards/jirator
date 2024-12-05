import React from 'react';

const CollapsedTicket = ({
  formData,
  isSubmitted,
  showValidation,
  isValid,
  validateForm,
  handleSubmit,
  handleCollapse,
  onRemove,
  showRemoveButton
}) => {
  return (
    <div 
      className="bg-slate-50 p-4 mb-4 border border-slate-200 hover:bg-slate-100 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => handleCollapse(false)}
        >
          <span className="font-medium">{formData.summary}</span>
          <span className="mx-2 text-slate-400">|</span>
          <span className="text-slate-600">Epic: {formData.epic}</span>
          {isSubmitted && (
            <span className="ml-2 text-emerald-500 text-sm">✓ Submitted</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {showValidation && !isValid() && (
            <div className="text-rose-500 text-sm">
              <ul className="list-none">
                {!formData.summary.trim() && (
                  <li>Summary is required</li>
                )}
                {!formData.epic.trim() && (
                  <li>Epic is required</li>
                )}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            {!isSubmitted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isValid()) {
                    validateForm();
                    setShowValidation(true);
                  } else {
                    handleSubmit(e);
                  }
                }}
                className={`${
                  isValid()
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : 'bg-slate-400'
                } text-white font-medium py-1 px-3 transition-colors`}
              >
                Submit
              </button>
            )}
            {showRemoveButton && !isSubmitted && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <div 
        className="text-sm text-slate-500 mt-1 cursor-pointer"
        onClick={() => handleCollapse(false)}
      >
        Click to {isSubmitted ? 'view details' : 'edit'}
      </div>
    </div>
  );
};

export default CollapsedTicket; 