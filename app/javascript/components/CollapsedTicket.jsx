import React from 'react';
import ValidationMessages from './ValidationMessages';
import TicketSummary from './TicketSummary';
import SubmitButtons from './SubmitButtons';

const CollapsedTicket = ({
  formData,
  isSubmitted,
  showValidation,
  isValid,
  validateForm,
  handleSubmit,
  handleCollapse,
  onRemove,
  showRemoveButton,
  ticketKey,
  jiraUrl,
  isLoading
}) => {
  return (
    <div className="bg-slate-50 p-4 mb-4 border border-slate-200 hover:bg-slate-100 transition-colors">
      <div className="flex justify-between items-center">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => handleCollapse(false)}
        >
          <TicketSummary 
            formData={formData}
            isSubmitted={isSubmitted}
            ticketKey={ticketKey}
            jiraUrl={jiraUrl}
          />
          <div className="flex items-center gap-2 text-slate-600">
            <span>Epic: {formData.epic}</span>
            {isSubmitted && (
              <span className="text-emerald-500 text-sm">✓ Submitted</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ValidationMessages 
            showValidation={showValidation}
            isValid={isValid}
            formData={formData}
          />
          <SubmitButtons 
            isValid={isValid}
            isSubmitted={isSubmitted}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleRemove={onRemove}
            showRemoveButton={showRemoveButton}
          />
        </div>
      </div>
    </div>
  );
};

export default CollapsedTicket; 