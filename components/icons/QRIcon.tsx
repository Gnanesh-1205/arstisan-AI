
import React from 'react';

export const QRIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M0 0h8v8H0V0zm2 2v4h4V2H2zM0 16h8v8H0v-8zm2 2v4h4v-4H2zM16 0h8v8h-8V0zm2 2v4h4V2h-4zM16 16h8v8h-8v-8zm2 2v4h4v-4h-4zM10 2h4v4h-4V2zM2 10h4v4H2v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zM6 6h4v4H6V6zm8 0h4v4h-4V6zM6 16h4v4H6v-4zm8 0h4v4h-4v-4z"/>
  </svg>
);
