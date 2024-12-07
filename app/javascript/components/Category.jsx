import React from 'react';
import JiraTicketForm from './JiraTicketForm';

const Category = ({ category, tickets, onDragOver, onDrop, onRemove, onAddTicket, setSubmitMessage, showFireworks }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    onDrop(ticketId);
  };

  const handleSubmitCategory = async () => {
    const ticketElements = tickets
      .map(t => t.ref?.current)
      .filter(Boolean);

    if (ticketElements.length === 0) {
      setSubmitMessage({
        type: 'warning',
        text: 'No tickets to submit'
      });
      return;
    }

    // First validate all tickets and collect validation results
    const validationResults = ticketElements.map(ticket => {
      if (ticket.isSubmitted()) {
        return { ticket, status: 'already-submitted' };
      }
      
      if (!ticket.isValid()) {
        ticket.showValidationErrors();
        return { ticket, status: 'invalid' };
      }
      
      return { ticket, status: 'valid' };
    });

    const validTickets = validationResults.filter(r => r.status === 'valid');
    const invalidTickets = validationResults.filter(r => r.status === 'invalid');
    const alreadySubmitted = validationResults.filter(r => r.status === 'already-submitted');

    // If no valid tickets and some invalid ones, show error
    if (validTickets.length === 0 && invalidTickets.length > 0) {
      setSubmitMessage({
        type: 'warning',
        text: `${invalidTickets.length} ticket${invalidTickets.length !== 1 ? 's' : ''} need${invalidTickets.length === 1 ? 's' : ''} to be corrected.`
      });
      return;
    }

    // If no tickets to submit at all, show message
    if (validTickets.length === 0) {
      setSubmitMessage({
        type: 'warning',
        text: alreadySubmitted.length > 0 ? 'All tickets have already been submitted.' : 'No valid tickets to submit'
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Submit all valid tickets in sequence
    for (const { ticket } of validTickets) {
      try {
        const success = await ticket.submit();
        if (success) {
          successCount++;
        } else {
          errorCount++;
          errors.push({ summary: ticket.getFormData().summary, error: 'Submission failed' });
        }
      } catch (error) {
        errorCount++;
        errors.push({ summary: ticket.getFormData().summary, error: error.message });
      }
    }

    // Construct result message
    let message = '';
    const parts = [];

    if (successCount > 0) {
      parts.push(`${successCount} ticket${successCount !== 1 ? 's' : ''} submitted successfully`);
    }
    
    if (errorCount > 0) {
      parts.push(`${errorCount} failed`);
    }
    
    if (invalidTickets.length > 0) {
      parts.push(`${invalidTickets.length} invalid`);
    }
    
    if (alreadySubmitted.length > 0) {
      parts.push(`${alreadySubmitted.length} already submitted`);
    }

    message = parts.join(', ');

    // If there were any errors, add error details
    if (errors.length > 0) {
      message += '\n\nErrors:\n' + errors.map(e => 
        `• "${e.summary}": ${e.error}`
      ).join('\n');
    }

    setSubmitMessage({
      type: errorCount === 0 && invalidTickets.length === 0 ? 'success' : 'warning',
      text: message
    });

    if (errorCount === 0 && invalidTickets.length === 0) {
      showFireworks();
    }
  };

  const colorClasses = {
    slate: 'bg-slate-50 border-slate-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const unsubmittedCount = tickets.filter(t => !t.isSubmitted).length;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${colorClasses[category.color] || colorClasses.slate}`}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddTicket(category.id)}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              title="Add ticket to this category"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {unsubmittedCount > 0 && (
              <button
                onClick={handleSubmitCategory}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
              >
                Submit Category ({unsubmittedCount})
              </button>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div
            key={ticket.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', ticket.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <JiraTicketForm 
              {...ticket}
              ref={ticket.ref}
              id={ticket.id}
              initialData={ticket.data}
              onChange={ticket.onChange}
              onRemove={ticket.onRemove}
              showRemoveButton={ticket.showRemoveButton}
              onSubmit={ticket.onSubmit}
              onCollapseChange={ticket.onCollapseChange}
              isSubmitted={ticket.isSubmitted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category; 