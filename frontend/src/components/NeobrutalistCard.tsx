import React from 'react';

interface NeobrutalistCardProps {
  children: React.ReactNode;
  bgColor?: 'bg-cream' | 'bg-beige' | 'bg-sage-light' | 'bg-dusty-light' | 'bg-gold-light' | 'bg-white';
  hoverEffect?: boolean;
  className?: string;
  shadowSize?: 'sm' | 'md' | 'lg';
}

export const NeobrutalistCard: React.FC<NeobrutalistCardProps> = ({
  children,
  bgColor = 'bg-white',
  hoverEffect = true,
  className = '',
  shadowSize = 'md',
}) => {
  const shadowClass = 
    shadowSize === 'sm' ? 'shadow-[2px_2px_0px_0px_var(--color-navy)]' :
    shadowSize === 'lg' ? 'shadow-[8px_8px_0px_0px_var(--color-navy)]' :
    'shadow-[4px_4px_0px_0px_var(--color-navy)]';

  const hoverClass = hoverEffect
    ? 'transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--color-navy)]'
    : '';

  return (
    <div
      className={`border-2 border-navy rounded-2xl p-6 ${bgColor} ${shadowClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
export default NeobrutalistCard;
