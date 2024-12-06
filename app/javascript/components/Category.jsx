import React from 'react';
import JiraTicketForm from './JiraTicketForm';

const Category = ({ category, tickets, onDragOver, onDrop, onRemove }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    onDrop(ticketId);
  };

  const handleSubmitCategory = async () => {
    const unsubmittedTickets = tickets.filter(ticket => !ticket.isSubmitted);
    if (unsubmittedTickets.length === 0) {
      alert('No tickets to submit in this category');
      return;
    }

    for (const ticket of unsubmittedTickets) {
      if (ticket.ref && ticket.ref.current) {
        await ticket.ref.current.submit();
      }
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
          {unsubmittedCount > 0 && (
            <button
              onClick={handleSubmitCategory}
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
            >
              Submit Category ({unsubmittedCount})
            </button>
          )}
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