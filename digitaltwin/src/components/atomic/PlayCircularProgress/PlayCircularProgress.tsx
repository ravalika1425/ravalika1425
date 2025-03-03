import React from 'react';

interface CircularProgressWithLabelProps {
  value: number;
  size?: number;
  className?: string;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  size = 70,
  className,
}) => {
  const strokeWidth = size / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = ((100 - value) / 100) * circumference;

  return (
    <div className={`circular-progress ${className ? className : ''}`} style={{ width: size, height: size }}>
      <svg className="progress-circle" width={size} height={size}>
        <circle
          className="progress-circle__background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-circle__progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: `${progressOffset}`,
          }}
        />
        <text
          className="progress-circle__label"
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size / 5}
        >
          {`${Math.round(value)}%`}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgressWithLabel;
