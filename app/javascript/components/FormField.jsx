import React from 'react';

const FormField = ({
  name,
  label,
  value,
  onChange,
  error,
  showValidation,
  isSubmitted,
  isTextarea = false
}) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  return (
    <div className="flex items-start">
      <span className="text-blue-600">"{label}"</span>
      <span className="mx-2 text-gray-600">:</span>
      <div className="flex-1">
        {isSubmitted ? (
          <div className="p-1 font-sans bg-slate-50 border border-gray-200 rounded whitespace-pre-wrap">
            {value || <span className="text-gray-400">No {label.toLowerCase()}</span>}
          </div>
        ) : (
          <InputComponent
            name={name}
            value={value}
            onChange={onChange}
            rows={isTextarea ? 3 : undefined}
            className={`w-full p-1 font-sans border rounded ${
              error ? 'border-rose-500' : 'border-gray-300'
            }`}
          />
        )}
        {showValidation && error && (
          <p className="mt-1 text-sm text-rose-500 font-sans">{error}</p>
        )}
      </div>
      <span className="ml-2 text-gray-600">,</span>
    </div>
  );
};

export default FormField; 