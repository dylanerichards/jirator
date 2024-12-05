import React, { useState, forwardRef } from 'react'

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
  })
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValid = () => {
    return formData.summary.trim() !== '';
  };

  if (isCollapsed) {
    return (
      <div 
        className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <div className="flex justify-between items-center">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => handleCollapse(false)}
          >
            <span className="font-medium">{formData.summary}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-600">Epic: {formData.epic}</span>
            {isSubmitted && (
              <span className="ml-2 text-green-500 text-sm">✓ Submitted</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isSubmitted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(e);
                }}
                disabled={!isValid()}
                className={`${
                  isValid()
                    ? 'bg-blue-500 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white font-bold py-1 px-3 rounded text-sm`}
                title={!isValid() ? 'Summary is required' : ''}
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
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div 
          className="text-sm text-gray-500 mt-1 cursor-pointer"
          onClick={() => handleCollapse(false)}
        >
          Click to {isSubmitted ? 'view details' : 'edit'}
        </div>
      </div>
    )
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