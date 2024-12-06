const JiraTicketGenerator = () => {
  const [tickets, setTickets] = useState([{ id: 1 }]);
  const ticketRefs = useRef({});

  const handleAddTicket = () => {
    setTickets(prev => [...prev, { id: prev.length + 1 }]);
  };

  const handleRemoveTicket = (id) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const handleSubmitAll = async () => {
    console.log('Submitting all tickets...');
    const ticketElements = Object.values(ticketRefs.current);
    
    // Check if there are any tickets to submit
    if (ticketElements.length === 0) {
      alert('No tickets to submit');
      return;
    }

    // Filter out already submitted tickets and invalid tickets
    const pendingTickets = ticketElements.filter(
      ticket => ticket && !ticket.isSubmitted() && ticket.isValid()
    );

    console.log('Pending tickets:', pendingTickets.length);

    if (pendingTickets.length === 0) {
      alert('No valid tickets to submit');
      return;
    }

    // Submit all tickets in sequence
    for (const ticket of pendingTickets) {
      try {
        await ticket.submit();
        console.log('Ticket submitted successfully');
      } catch (error) {
        console.error('Error submitting ticket:', error);
        // Continue with next ticket even if one fails
      }
    }

    console.log('All tickets submitted');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">JIRA Ticket Generator</h1>
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

      <div className="space-y-4">
        {tickets.map(ticket => (
          <JiraTicketForm
            key={ticket.id}
            ref={el => ticketRefs.current[ticket.id] = el}
            id={ticket.id}
            onRemove={() => handleRemoveTicket(ticket.id)}
            showRemoveButton={tickets.length > 1}
            onSubmit={(data) => {
              console.log(`Ticket ${ticket.id} submitted:`, data);
            }}
            onCollapseChange={() => {
              // Handle collapse change if needed
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default JiraTicketGenerator; 