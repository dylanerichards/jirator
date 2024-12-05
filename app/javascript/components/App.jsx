import React, { useState, useRef } from 'react'
import JiraTicketForm from './JiraTicketForm'

const App = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      data: {
        summary: '',
        description: '',
        priority: 'Medium',
        epic: '',
        assignee: '',
        labels: ''
      }
    }
  ]);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [areAllCollapsed, setAreAllCollapsed] = useState(false);
  const ticketRefs = useRef([]);

  const handleRemove = (ticketId) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    setSubmitMessage(null);
  };

  const handleSubmit = (ticketId, data) => {
    console.log('Submitting ticket:', data);
  };

  const handleCollapseAll = () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    refs.forEach(ref => {
      ref.setCollapsed(true);
    });
    setAreAllCollapsed(true);
  };

  const handleExpandAll = () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    refs.forEach(ref => {
      ref.setCollapsed(false);
    });
    setAreAllCollapsed(false);
  };

  const handleAddTicket = () => {
    const newId = Math.max(0, ...tickets.map(t => t.id)) + 1;
    setTickets(prev => [...prev, {
      id: newId,
      data: {
        summary: '',
        description: '',
        priority: 'Medium',
        epic: '',
        assignee: '',
        labels: ''
      }
    }]);
  };

  const handleSubmitAll = () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    let invalidCount = 0;
    let validCount = 0;
    let totalUnsubmitted = 0;
    
    // Count unsubmitted tickets and validate them
    refs.forEach(ref => {
      if (!ref.isSubmitted()) {
        totalUnsubmitted++;
        const isValid = ref.validate();
        if (!isValid) {
          ref.showValidationErrors();
          invalidCount++;
        }
      }
    });

    // Submit all valid tickets
    refs.forEach(ref => {
      if (!ref.isSubmitted()) {
        const isValid = ref.validate();
        if (isValid) {
          const data = ref.getFormData();
          handleSubmit(null, data);
          ref.setSubmitted(true);
          validCount++;
        }
      }
      // Collapse all tickets, regardless of submission status
      ref.setCollapsed(true);
    });

    // Update areAllCollapsed state
    setAreAllCollapsed(true);

    // Always show a message about the results
    if (totalUnsubmitted > 0) {
      if (invalidCount > 0) {
        setSubmitMessage({
          type: 'warning',
          text: `${validCount} of ${totalUnsubmitted} tickets submitted. ${invalidCount} ticket${invalidCount !== 1 ? 's' : ''} need${invalidCount === 1 ? 's' : ''} to be corrected.`
        });
      } else {
        setSubmitMessage({
          type: 'success',
          text: `All ${validCount} ticket${validCount !== 1 ? 's' : ''} submitted successfully!`
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {submitMessage && (
        <div 
          className={`mb-4 p-4 ${
            submitMessage.type === 'warning' 
              ? 'bg-amber-50 border border-amber-200 text-amber-800' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {submitMessage.text}
        </div>
      )}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleAddTicket}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 transition-colors"
            title="Add a new ticket"
          >
            Add Ticket
          </button>
          <button
            onClick={areAllCollapsed ? handleExpandAll : handleCollapseAll}
            className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 transition-colors"
            title={areAllCollapsed ? 'Expand all tickets' : 'Collapse all tickets'}
          >
            {areAllCollapsed ? 'Expand All' : 'Collapse All'}
          </button>
        </div>
        <button
          onClick={() => handleSubmitAll()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 transition-colors"
          title="Submit all tickets"
        >
          Submit All
        </button>
      </div>
      {tickets.map(ticket => (
        <JiraTicketForm
          key={ticket.id}
          id={ticket.id}
          initialData={ticket.data}
          onRemove={() => handleRemove(ticket.id)}
          onSubmit={(data) => handleSubmit(ticket.id, data)}
          showRemoveButton={true}
          onCollapseChange={() => {
            const refs = Object.values(ticketRefs.current).filter(Boolean);
            const allCollapsed = refs.every(ref => ref.isCollapsed());
            setAreAllCollapsed(allCollapsed);
          }}
          ref={(el) => (ticketRefs.current[ticket.id] = el)}
        />
      ))}
    </div>
  );
};

export default App 