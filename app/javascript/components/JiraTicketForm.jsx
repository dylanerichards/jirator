import React, { forwardRef, useImperativeHandle, useState } from 'react';
import CollapsedTicket from './CollapsedTicket';

const JiraTicketForm = forwardRef(({ 
  id, 
  initialData, 
  onRemove, 
  showRemoveButton, 
  onSubmit, 
  onCollapseChange 
}, ref) => {
  const [formData, setFormData] = useState(initialData || {
    summary: '',
    description: '',
    priority: 'Medium',
    epic: '',
    assignee: '',
    labels: ''
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleCollapse = (value) => {
    setIsCollapsed(value)
    setTimeout(() => onCollapseChange?.(), 0)
  }

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitted) {
      return // Prevent resubmission
    }
    if (validateForm()) {
      console.log('Submitting single ticket:', formData)
      onSubmit(formData)
      setIsSubmitted(true)
      setIsCollapsed(true)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required'
    }
    if (!formData.epic.trim()) {
      newErrors.epic = 'Epic is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValid = () => {
    return formData.summary.trim() !== '' && formData.epic.trim() !== '';
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    setCollapsed: (value) => handleCollapse(value),
    isSubmitted: () => isSubmitted,
    setSubmitted: (value) => setIsSubmitted(value),
    validate: () => {
      console.log('Validating form');
      const result = validateForm();
      if (!result) {
        setShowValidation(true);
      }
      console.log('Validation result:', result, 'showValidation:', showValidation);
      return result;
    },
    isCollapsed: () => isCollapsed,
    showValidationErrors: () => {
      console.log('Setting showValidation to true');
      setShowValidation(true);
    }
  }));

  if (isCollapsed) {
    return (
      <CollapsedTicket
        formData={formData}
        isSubmitted={isSubmitted}
        showValidation={showValidation}
        isValid={isValid}
        validateForm={validateForm}
        handleSubmit={handleSubmit}
        handleCollapse={handleCollapse}
        onRemove={onRemove}
        showRemoveButton={showRemoveButton}
      />
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-4">
      <div className="flex justify-between mb-4">
        <button 
          onClick={() => handleCollapse(true)}
          className="text-gray-500 hover:text-gray-700"
        >
          Collapse ↑
        </button>
        {showRemoveButton && !isSubmitted && (
          <button 
            onClick={onRemove} 
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        )}
      </div>

      <div className="font-mono">
        {'{'}
        {Object.entries(formData).map(([key, value], index, array) => (
          <div key={key} className="ml-8 mb-8 flex items-center">
            <label 
              htmlFor={`input-${key}`} 
              className="font-bold self-start mt-2 w-24 text-right cursor-pointer"
            >
              "{key}":
            </label>
            {key === 'description' ? (
              <textarea
                id={`input-${key}`}
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-1/2 p-2 ml-12 rounded border font-sans ${
                  isSubmitted 
                    ? 'bg-gray-100 text-gray-600 border-gray-200' 
                    : errors[key] 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                }`}
                rows="4"
                disabled={isSubmitted}
              />
            ) : (
              <input
                id={`input-${key}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`p-2 ml-12 rounded border font-sans ${
                  isSubmitted 
                    ? 'bg-gray-100 text-gray-600 border-gray-200' 
                    : errors[key] 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300'
                }`}
                disabled={isSubmitted}
              />
            )}
            {errors[key] && !isSubmitted && (
              <span className="text-red-500 text-sm ml-2">
                {errors[key]}
              </span>
            )}
            {index !== array.length - 1 ? ',' : ''}
          </div>
        ))}
        {'}'}
      </div>
      
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Ticket
        </button>
      ) : (
        <div className="mt-4 text-green-500">
          ✓ Ticket submitted
        </div>
      )}
    </div>
  )
})

export default JiraTicketForm 