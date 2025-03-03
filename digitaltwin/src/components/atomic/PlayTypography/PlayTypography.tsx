import React from 'react';
interface PlayTypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  children: React.ReactNode; 
  color?: string; 
  weight?: number; 
}

const PlayTypography: React.FC<PlayTypographyProps> = ({
  variant,
  children,
  color,
  weight,
  // ...props
}) => {
  
  const customStyles = {
    ...(color && { color: PlaytypographyColor(color) }),
    ...(weight && { fontWeight: PlaytypographyWeight(weight) }),
  };

  return (
    <span className={`Play-typography ${variant}`} style={customStyles}>
      {children}
    </span>
  );
};


function PlaytypographyColor(color: string): string {
  return color; 
}

function PlaytypographyWeight(weight: number): number {
  return weight; 
}

export default PlayTypography;
