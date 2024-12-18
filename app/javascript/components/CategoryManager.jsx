import React, { useState } from 'react';
import CategoryList from './CategoryList';
import CategoryCreator from './CategoryCreator';

const CategoryManager = ({ 
  tickets, 
  onMoveTicket, 
  onAddTicket, 
  setSubmitMessage, 
  showFireworks 
}) => {
  const [categories, setCategories] = useState([
    { id: 'default', name: 'Uncategorized', color: 'slate' }
  ]);

  const handleAddCategory = (categoryData) => {
    setCategories(prev => [...prev, {
      id: `category-${Date.now()}`,
      ...categoryData
    }]);
  };

  const handleRemoveCategory = (categoryId) => {
    // Move all tickets from the removed category back to 'default'
    tickets
      .filter(ticket => ticket.categoryId === categoryId)
      .forEach(ticket => onMoveTicket(ticket.id, 'default'));

    // Remove the category
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  return (
    <div className="space-y-4">
      <CategoryCreator onAdd={handleAddCategory} />
      <CategoryList 
        categories={categories}
        tickets={tickets}
        onMoveTicket={onMoveTicket}
        onRemoveCategory={handleRemoveCategory}
        onAddTicket={onAddTicket}
        setSubmitMessage={setSubmitMessage}
        showFireworks={showFireworks}
      />
    </div>
  );
};

export default CategoryManager; 