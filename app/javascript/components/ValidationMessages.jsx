import React from 'react';

const ValidationMessages = ({ showValidation, isValid, formData }) => {
  if (!showValidation || isValid()) return null;

  return (
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
  );
};

export default ValidationMessages; 