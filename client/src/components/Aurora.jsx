import React from 'react';
import './Aurora.css';

export default function Aurora(props) {
  const {
    colorStops = ["#5227FF", "#7cff67", "#5227FF"]
  } = props;

  return (
    <div className="aurora-container">
      <div 
        className="aurora-gradient"
        style={{
          background: `linear-gradient(45deg, ${colorStops.join(', ')})`
        }}
      />
    </div>
  );
}
