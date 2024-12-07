import React, { useState, useRef } from 'react';
import CategoryManager from './CategoryManager';
import confetti from 'canvas-confetti';

const JiraTicketGenerator = () => {
  const [tickets, setTickets] = useState([{ 
    id: 1, 
    categoryId: 'default',
    isSubmitted: false,
    isCollapsed: false,
    ticketKey: null,
    jiraUrl: null,
    data: { 
      summary: '',
      description: '',
      epic: '',
      assignee: '',
      labels: ''
    }
  }]);
  const [submitMessage, setSubmitMessage] = useState(null);
  const ticketRefs = useRef({});

  const showFireworks = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };

  const handleAddTicket = () => {
    const newId = Math.max(0, ...tickets.map(t => t.id)) + 1;
    setTickets(prev => [...prev, { 
      id: newId,
      categoryId: 'default',
      isSubmitted: false,
      isCollapsed: false,
      ticketKey: null,
      jiraUrl: null,
      data: { 
        summary: '',
        description: '',
        epic: '',
        assignee: '',
        labels: ''
      }
    }]);
  };

  const handleAddTicketToCategory = (categoryId) => {
    const newId = Math.max(0, ...tickets.map(t => t.id)) + 1;
    setTickets(prev => [...prev, { 
      id: newId,
      categoryId,
      isSubmitted: false,
      isCollapsed: false,
      ticketKey: null,
      jiraUrl: null,
      data: { 
        summary: '',
        description: '',
        epic: '',
        assignee: '',
        labels: ''
      }
    }]);
  };

  const handleRemoveTicket = (id) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const handleSubmitAll = async () => {
    console.log('Submitting all tickets...');
    const ticketElements = Object.values(ticketRefs.current).map(ref => ref.current).filter(Boolean);
    
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

    // Construct detailed message
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

  const handleMoveTicket = (ticketId, categoryId) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === parseInt(ticketId) ? { ...ticket, categoryId } : ticket
    ));
  };

  const handleTicketDataUpdate = (ticketId, newData) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, data: newData }
        : ticket
    ));
  };

  const handleTicketSubmitted = (ticketId, ticketKey, jiraUrl) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            isSubmitted: true,
            ticketKey,
            jiraUrl
          }
        : ticket
    ));
  };

  const handleCollapseChange = (ticketId, isCollapsed) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, isCollapsed }
        : ticket
    ));
  };

  return (
    <div className="p-4">
      {submitMessage && (
        <div 
          className={`mb-4 p-4 rounded-md whitespace-pre-wrap ${
            submitMessage.type === 'warning' 
              ? 'bg-amber-50 border border-amber-200 text-amber-800' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {submitMessage.text}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={handleSubmitAll}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Submit All
          </button>
          <button
            onClick={handleAddTicket}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Add Ticket
          </button>
        </div>
      </div>

      <CategoryManager 
        tickets={tickets.map(ticket => {
          const ref = React.createRef();
          ticketRefs.current[ticket.id] = ref;
          
          return {
            ...ticket,
            ref,
            onRemove: () => handleRemoveTicket(ticket.id),
            onSubmit: (data, ticketKey, jiraUrl) => {
              handleTicketDataUpdate(ticket.id, data);
              handleTicketSubmitted(ticket.id, ticketKey, jiraUrl);
              console.log(`Ticket ${ticket.id} submitted:`, data);
            },
            showRemoveButton: tickets.length > 1,
            onCollapseChange: (isCollapsed) => handleCollapseChange(ticket.id, isCollapsed),
            initialData: ticket.data,
            onChange: (newData) => !ticket.isSubmitted && handleTicketDataUpdate(ticket.id, newData),
            isSubmitted: ticket.isSubmitted,
            defaultCollapsed: ticket.isCollapsed,
            ticketKey: ticket.ticketKey,
            jiraUrl: ticket.jiraUrl
          };
        })}
        onMoveTicket={handleMoveTicket}
        onAddTicket={handleAddTicketToCategory}
        setSubmitMessage={setSubmitMessage}
        showFireworks={showFireworks}
      />
    </div>
  );
};

export default JiraTicketGenerator; 