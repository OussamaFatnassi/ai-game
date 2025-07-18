import React from 'react';

interface InventoryProps {
  items: string[];
}

const ItemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[hsl(var(--primary))] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4zM5 10a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
    </svg>
)

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  return (
    <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))] p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4 border-b border-[hsl(var(--border))] pb-2">Inventory</h3>
      {items.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))] italic">Your pockets are empty.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center p-2 rounded">
              <ItemIcon />
              <span className="text-[hsl(var(--muted-foreground))] capitalize">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory;