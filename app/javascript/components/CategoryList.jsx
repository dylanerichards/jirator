import React from 'react';
import Category from './Category';

const CategoryList = ({ 
  categories, 
  tickets, 
  onMoveTicket, 
  onRemoveCategory, 
  onAddTicket,
  setSubmitMessage,
  showFireworks
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(category => (
        <Category
          key={category.id}
          category={category}
          tickets={tickets.filter(t => t.categoryId === category.id)}
          onDragOver={handleDragOver}
          onDrop={(ticketId) => onMoveTicket(ticketId, category.id)}
          onRemove={category.id !== 'default' ? () => onRemoveCategory(category.id) : null}
          onAddTicket={onAddTicket}
          setSubmitMessage={setSubmitMessage}
          showFireworks={showFireworks}
        />
      ))}
    </div>
  );
};

export default CategoryList; 