import React, { useState, useRef } from 'react';
import CategoryManager from './CategoryManager';
import confetti from 'canvas-confetti';

const JiraTicketGenerator = () => {
  const [tickets, setTickets] = useState([{ 
    id: 1, 
    categoryId: 'default',
    isSubmitted: false,
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
    setTickets(prev => [...prev, { 
      id: prev.length + 1,
      categoryId: 'default',
      isSubmitted: false,
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

    // First validate all tickets and show validation errors
    let invalidCount = 0;
    ticketElements.forEach(ticket => {
      if (!ticket.isSubmitted() && !ticket.isValid()) {
        ticket.showValidationErrors();
        invalidCount++;
      }
    });

    if (invalidCount > 0) {
      setSubmitMessage({
        type: 'warning',
        text: `${invalidCount} ticket${invalidCount !== 1 ? 's' : ''} need${invalidCount === 1 ? 's' : ''} to be corrected.`
      });
      return;
    }

    const pendingTickets = ticketElements.filter(
      ticket => ticket && !ticket.isSubmitted() && ticket.isValid()
    );

    console.log('Pending tickets:', pendingTickets.length);

    if (pendingTickets.length === 0) {
      setSubmitMessage({
        type: 'warning',
        text: 'No valid tickets to submit'
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Submit all tickets in sequence
    for (const ticket of pendingTickets) {
      try {
        const success = await ticket.submit();
        if (success) {
          successCount++;
          console.log('Ticket submitted successfully');
        } else {
          errorCount++;
          console.error('Ticket submission returned false');
        }
      } catch (error) {
        errorCount++;
        console.error('Error submitting ticket:', error);
      }
    }

    if (errorCount === 0) {
      setSubmitMessage({
        type: 'success',
        text: `All ${successCount} ticket${successCount !== 1 ? 's' : ''} submitted successfully!`
      });
      showFireworks();
    } else {
      setSubmitMessage({
        type: 'warning',
        text: `${successCount} of ${pendingTickets.length} tickets submitted. ${errorCount} ticket${errorCount !== 1 ? 's' : ''} failed.`
      });
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

  const handleTicketSubmitted = (ticketId) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, isSubmitted: true }
        : ticket
    ));
  };

  return (
    <div className="p-4">
      {submitMessage && (
        <div 
          className={`mb-4 p-4 rounded-md ${
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
          const ref = React.createRef();  // Create a ref for each ticket
          ticketRefs.current[ticket.id] = ref;  // Store the ref
          
          return {
            ...ticket,
            ref,  // Pass the ref instead of the ref callback
            onRemove: () => handleRemoveTicket(ticket.id),
            onSubmit: (data) => {
              handleTicketDataUpdate(ticket.id, data);
              handleTicketSubmitted(ticket.id);
              console.log(`Ticket ${ticket.id} submitted:`, data);
            },
            showRemoveButton: tickets.length > 1,
            onCollapseChange: () => {
              // Handle collapse change if needed
            },
            initialData: ticket.data,
            onChange: (newData) => !ticket.isSubmitted && handleTicketDataUpdate(ticket.id, newData),
            isSubmitted: ticket.isSubmitted
          };
        })}
        onMoveTicket={handleMoveTicket}
      />
    </div>
  );
};

export default JiraTicketGenerator; 