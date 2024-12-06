import React from 'react';

const TicketSummary = ({ formData, isSubmitted, ticketKey, jiraUrl }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{formData.summary}</span>
      {isSubmitted && ticketKey && (
        <a
          href={`https://${jiraUrl}/browse/${ticketKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {ticketKey} ↗
        </a>
      )}
    </div>
  );
};

export default TicketSummary; 