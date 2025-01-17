import React from 'react';
import * as Icons from 'lucide-react';
import { Plus } from 'lucide-react';

type ServiceCardProps = {
  id: string;
  title: string;
  description: string;
  icon: string;
  onAdd: (id: string) => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  icon,
  onAdd,
}) => {
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="group relative cursor-grab active:cursor-grabbing transform hover:scale-[1.02] transition-all duration-300 md:cursor-grab md:active:cursor-grabbing"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="p-4 rounded-lg bg-background/50 border border-accent/20 hover:border-accent/40 hover:shadow-glow transition-all duration-300">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-md bg-accent/10 shrink-0">
            <IconComponent className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-text">{title}</h3>
            <p className="text-sm text-text/70 mt-1">{description}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => onAdd(id)}
        className="md:hidden absolute top-2 right-2 p-1.5 rounded-full bg-accent/10 text-accent opacity-100 hover:bg-accent hover:text-text transition-all duration-300"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ServiceCard;
