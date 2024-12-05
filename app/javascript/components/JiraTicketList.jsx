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