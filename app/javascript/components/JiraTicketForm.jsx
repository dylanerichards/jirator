import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const contentRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (showValidation) {
      validateForm();
    }
  };

  const isValid = () => {
    return formData.summary.trim() !== '' && formData.epic.trim() !== '';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!formData.epic.trim()) {
      newErrors.epic = 'Epic is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValid()) {
      validateForm();
      setShowValidation(true);
      return;
    }
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
    setIsSubmitted(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCollapse = (value) => {
    const element = contentRef.current;
    if (!element) return;

    element.style.height = element.scrollHeight + 'px';
    element.offsetHeight; // Force reflow

    if (value) {
      requestAnimationFrame(() => {
        element.style.height = '64px';
      });
    } else {
      element.style.height = '64px';
      requestAnimationFrame(() => {
        element.style.height = element.scrollHeight + 'px';
        setTimeout(() => {
          element.style.height = 'auto';
        }, 300);
      });
    }

    setIsCollapsed(value);
    onCollapseChange();
  };

  const handleRemove = (e) => {
    if (e) e.stopPropagation();
    const element = document.getElementById(`ticket-${id}`);
    if (element) {
      element.style.height = element.offsetHeight + 'px';
      setIsRemoving(true);
      requestAnimationFrame(() => {
        element.style.height = '0px';
      });
      setTimeout(() => {
        onRemove();
      }, 300);
    }
  };

  useImperativeHandle(ref, () => ({
    validate: isValid,
    showValidationErrors: () => {
      validateForm();
      setShowValidation(true);
    },
    getFormData: () => formData,
    setSubmitted: (value) => {
      setIsSubmitted(value);
    },
    isSubmitted: () => isSubmitted,
    setCollapsed: (value) => {
      handleCollapse(value);
    },
    isCollapsed: () => isCollapsed,
    setLoading: (value) => setIsLoading(value)
  }));

  const containerClasses = `
    bg-slate-50 p-4 border border-slate-200
    transition-all duration-300 ease-in-out
    ${isRemoving ? 'opacity-0 scale-95' : isNew ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
    ${!isCollapsed ? '' : 'hover:bg-slate-100'}
  `.trim();

  const wrapperClasses = `
    overflow-hidden
    transition-[height,opacity] duration-300 ease-in-out
    ${isRemoving ? 'mb-0' : 'mb-4'}
  `.trim();

  const expandedContent = (
    <div className={containerClasses}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium">Ticket {id}</h2>
        <div className="flex gap-2">
          <button
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
              onClick={handleRemove}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded transition-colors"
              disabled={isLoading}
            >
              Remove
            </button>
          )}
          <button
            onClick={() => handleCollapse(true)}
            className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Collapse
          </button>
        </div>
      </div>

      <div className="font-mono text-sm">
        {'{'}
        <div className="ml-4 space-y-2">
          <div className="flex items-start">
            <span className="text-blue-600">"summary"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className={`w-full p-1 font-sans border rounded ${
                  errors.summary ? 'border-rose-500' : 'border-gray-300'
                }`}
              />
              {showValidation && errors.summary && (
                <p className="mt-1 text-sm text-rose-500 font-sans">{errors.summary}</p>
              )}
            </div>
            <span className="ml-2 text-gray-600">,</span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-600">"description"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-1 font-sans border border-gray-300 rounded"
              />
            </div>
            <span className="ml-2 text-gray-600">,</span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-600">"priority"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full p-1 font-sans border border-gray-300 rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <span className="ml-2 text-gray-600">,</span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-600">"epic"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <input
                type="text"
                name="epic"
                value={formData.epic}
                onChange={handleInputChange}
                className={`w-full p-1 font-sans border rounded ${
                  errors.epic ? 'border-rose-500' : 'border-gray-300'
                }`}
              />
              {showValidation && errors.epic && (
                <p className="mt-1 text-sm text-rose-500 font-sans">{errors.epic}</p>
              )}
            </div>
            <span className="ml-2 text-gray-600">,</span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-600">"assignee"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleInputChange}
                className="w-full p-1 font-sans border border-gray-300 rounded"
              />
            </div>
            <span className="ml-2 text-gray-600">,</span>
          </div>

          <div className="flex items-start">
            <span className="text-blue-600">"labels"</span>
            <span className="mx-2 text-gray-600">:</span>
            <div className="flex-1">
              <input
                type="text"
                name="labels"
                value={formData.labels}
                onChange={handleInputChange}
                className="w-full p-1 font-sans border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
        {'}'}
      </div>
    </div>
  );

  const content = isCollapsed ? (
    <CollapsedTicket
      formData={formData}
      isSubmitted={isSubmitted}
      showValidation={showValidation}
      isValid={isValid}
      validateForm={validateForm}
      handleSubmit={handleSubmit}
      handleCollapse={handleCollapse}
      onRemove={handleRemove}
      showRemoveButton={showRemoveButton}
      isLoading={isLoading}
      containerClasses={containerClasses}
    />
  ) : expandedContent;

  return (
    <div id={`ticket-${id}`} className={wrapperClasses}>
      <div ref={contentRef}>
        {content}
      </div>
    </div>
  );
});

export default JiraTicketForm; 