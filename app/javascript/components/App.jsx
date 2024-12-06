import React, { useState, useRef } from 'react'
import confetti from 'canvas-confetti';
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

  const handleSubmitAll = async () => {
    const refs = Object.values(ticketRefs.current).filter(Boolean);
    let invalidCount = 0;
    let validCount = 0;
    let totalUnsubmitted = 0;
    
    // First pass: validate all tickets
    refs.forEach(ref => {
      if (!ref.isSubmitted()) {
        totalUnsubmitted++;
        if (!ref.isValid()) {
          ref.showValidationErrors();
          invalidCount++;
        }
      }
    });

    // Second pass: submit valid tickets
    for (const ref of refs) {
      if (!ref.isSubmitted() && ref.isValid()) {
        await ref.submit();
        validCount++;
      }
      ref.setCollapsed(true);
    }

    setAreAllCollapsed(true);

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
        showFireworks();
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