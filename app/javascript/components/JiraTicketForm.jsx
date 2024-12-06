import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';
import CollapsedTicket from './CollapsedTicket';
import TicketHeader from './TicketHeader';
import FormField from './FormField';
import SubmitButtons from './SubmitButtons';

const JiraTicketForm = forwardRef(({ 
  id, 
  initialData, 
  onChange,
  onRemove, 
  showRemoveButton, 
  onSubmit, 
  onCollapseChange,
  isSubmitted
}, ref) => {
  const [formData, setFormData] = useState(initialData || {
    summary: '',
    description: '',
    epic: '',
    assignee: '',
    labels: ''
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const contentRef = useRef(null);
  const [projectKey, setProjectKey] = useState(null);
  const [ticketKey, setTicketKey] = useState(null);
  const [jiraUrl, setJiraUrl] = useState(null);

  useEffect(() => {
    fetch('/api/config')
      .then(response => response.json())
      .then(data => {
        if (data.jira_project_key) {
          setProjectKey(data.jira_project_key);
          setJiraUrl(data.jira_base_url || 'your-domain.atlassian.net');
        }
      })
      .catch(error => {
        console.error('Error fetching config:', error);
      });
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      return newData;
    });
    if (showValidation) {
      validateForm();
    }
  };

  const isValid = () => {
    return formData.summary.trim() !== '' && 
           formData.epic.trim() !== '' && 
           projectKey !== null && 
           projectKey !== undefined;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!formData.epic.trim()) {
      newErrors.epic = 'Epic is required';
    }
    if (!projectKey) {
      newErrors.projectKey = 'Project key is missing';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!isValid()) {
      validateForm();
      setShowValidation(true);
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/jira_tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({
          ticket: {
            ...formData,
            project_key: projectKey
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTicketKey(data.ticket_key);
        onSubmit(formData);
        return true;
      } else {
        console.error('Failed to create JIRA ticket:', data.error);
        alert(`Failed to create JIRA ticket: ${data.error}`);
        return false;
      }
    } catch (error) {
      console.error('Error creating JIRA ticket:', error);
      alert('Error creating JIRA ticket. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
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
        element.style.height = '120px';
      });
    } else {
      element.style.height = '120px';
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
    submit: handleSubmit,
    isValid: () => isValid(),
    isSubmitted: () => isSubmitted,
    validate: validateForm,
    showValidationErrors: () => setShowValidation(true),
    getFormData: () => formData,
    setCollapsed: handleCollapse,
    isCollapsed: () => isCollapsed
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
      <TicketHeader 
        handleCollapse={handleCollapse}
        isSubmitted={isSubmitted}
        ticketKey={ticketKey}
        jiraUrl={jiraUrl}
      />

      <div className={`font-mono text-sm ${isSubmitted ? 'opacity-75' : ''}`}>
        {'{'}
        <div className="ml-4 space-y-2">
          <FormField
            name="summary"
            label="summary"
            value={formData.summary}
            onChange={handleInputChange}
            error={errors.summary}
            showValidation={showValidation}
            isSubmitted={isSubmitted}
          />
          
          <FormField
            name="description"
            label="description"
            value={formData.description}
            onChange={handleInputChange}
            isTextarea={true}
            isSubmitted={isSubmitted}
          />

          <FormField
            name="epic"
            label="epic"
            value={formData.epic}
            onChange={handleInputChange}
            error={errors.epic}
            showValidation={showValidation}
            isSubmitted={isSubmitted}
          />
        </div>
        {'}'}
      </div>

      <SubmitButtons 
        isValid={isValid}
        isSubmitted={isSubmitted}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleRemove={handleRemove}
        showRemoveButton={showRemoveButton}
      />
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
      onRemove={onRemove}
      showRemoveButton={showRemoveButton}
      ticketKey={ticketKey}
      jiraUrl={jiraUrl}
      isLoading={isLoading}
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