import React, { useEffect, useState } from 'react';
import './Snowfall.css';

const Snowfall = ({ snowflakeCount = 50 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = [];
    for (let i = 0; i < snowflakeCount; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100 + 'vw',
        animationDuration: Math.random() * 3 + 2 + 's',
        animationDelay: Math.random() * 5 + 's',
        size: Math.random() * 5 + 2 + 'px',
      });
    }
    setSnowflakes(flakes);
  }, [snowflakeCount]);

  return (
    <div className="snowfall-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
