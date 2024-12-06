import React from 'react';

const TicketHeader = ({ 
  handleCollapse, 
  isSubmitted, 
  ticketKey, 
  jiraUrl 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleCollapse(true)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {isSubmitted && ticketKey && jiraUrl && (
          <a
            href={`https://${jiraUrl}/browse/${ticketKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
          >
            {ticketKey} ↗
          </a>
        )}
      </div>
    </div>
  );
};

export default TicketHeader; 