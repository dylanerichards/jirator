import React, { useState } from 'react';
import CategoryList from './CategoryList';
import CategoryCreator from './CategoryCreator';

const CategoryManager = ({ tickets, onMoveTicket }) => {
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
    // Move tickets from the removed category back to 'Uncategorized'
    onMoveTicket(categoryId, 'default');
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
      />
    </div>
  );
};

export default CategoryManager; 