import React, { useState, useEffect } from 'react';

interface CounterProps {
  endValue: number;
}

const Counter: React.FC<CounterProps> = ({ endValue }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < endValue) {
        setCount(prevCount => prevCount + 1);
      } else {
        setCount(0); // Reset count to 0 when it reaches endValue
      }
    }, 100); // Interval time in milliseconds, adjust as needed

    return () => clearInterval(interval);
  }, [count, endValue]); // Include count and endValue in the dependencies array

  const circleStyle: React.CSSProperties = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'white',
    color: '#22195D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    border:'3px solid #22195D'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div style={circleStyle}>{count}</div>
    </div>
  );
};

export default Counter;
