import React from 'react';
import * as Icons from 'lucide-react';

type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  selected,
  onClick,
}) => {
  // Ensure the icon exists in lucide-react
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg transition-all duration-300 text-left h-full border
        ${
          selected
            ? 'bg-accent text-text border-accent'
            : 'bg-background/50 border-accent/20 hover:border-accent/40'
        }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-md ${selected ? 'bg-accent/80' : 'bg-accent/10'}`}>
          <IconComponent className={`w-6 h-6 ${selected ? 'text-text' : 'text-accent'}`} />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className={`text-sm ${selected ? 'text-text/90' : 'text-text/70'}`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;