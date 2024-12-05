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

  const areAllTicketsSubmitted = () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    if (refs.length === 0) return false;

    return refs.every(ref => {
      console.log('Ticket submission status:', ref.isSubmitted()); // Debug log
      return ref.isSubmitted();
    });
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