import React, { useState } from 'react';
import JiraTicketForm from './JiraTicketForm';

const JiraTicketList = () => {
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

  const handleRemove = (ticketId) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const handleSubmit = (ticketId, data) => {
    console.log('Submitting ticket:', data);
  };

  const handleSubmitAll = () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    let invalidCount = 0;
    let validCount = 0;
    
    console.log('Starting submit all process');
    
    // First pass: validate all tickets and collect results
    const validationResults = refs.map(ref => {
      if (!ref.isSubmitted()) {
        console.log('Validating ticket');
        const isValid = ref.validate(); // First validate to check
        console.log('Ticket valid?', isValid);
        
        if (!isValid) {
          ref.showValidationErrors(); // Explicitly call showValidationErrors for invalid tickets
          invalidCount++;
        }
        return { ref, isValid };
      }
      return { ref, isValid: true };
    });

    // Second pass: submit only the valid tickets
    validationResults.forEach(({ ref, isValid }) => {
      if (!ref.isSubmitted() && isValid) {
        const data = ref.getFormData();
        handleSubmit(null, data);
        ref.setSubmitted(true);
        validCount++;
      }
    });

    if (invalidCount > 0) {
      setSubmitMessage({
        type: 'warning',
        text: `${validCount} ticket${validCount !== 1 ? 's' : ''} submitted successfully. ${invalidCount} ticket${invalidCount !== 1 ? 's' : ''} could not be submitted due to validation errors. Please fix the errors and try submitting again.`
      });
    } else if (validCount > 0) {
      setSubmitMessage({
        type: 'success',
        text: `All tickets submitted successfully!`
      });
    }
  };

  return (
    <div>
      {tickets.map(ticket => (
        <JiraTicketForm
          key={ticket.id}
          id={ticket.id}
          initialData={ticket.data}
          onRemove={() => handleRemove(ticket.id)}
          onSubmit={(data) => handleSubmit(ticket.id, data)}
          showRemoveButton={true}
          onCollapseChange={() => {}}
        />
      ))}
    </div>
  );
};

export default JiraTicketList;