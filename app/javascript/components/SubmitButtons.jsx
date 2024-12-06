import React from 'react';

const SubmitButtons = ({
  isValid,
  isSubmitted,
  isLoading,
  handleSubmit,
  handleRemove,
  showRemoveButton
}) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid() || isSubmitted || isLoading}
        className={`${
          isValid() && !isSubmitted && !isLoading
            ? 'bg-indigo-500 hover:bg-indigo-600'
            : 'bg-slate-400'
        } text-white font-medium py-2 px-4 rounded transition-colors relative`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : isSubmitted ? 'Submitted' : 'Submit Ticket'}
      </button>
      {showRemoveButton && !isSubmitted && (
        <button
          type="button"
          onClick={handleRemove}
          className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded transition-colors"
          disabled={isLoading}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default SubmitButtons; 