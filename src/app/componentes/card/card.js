"use client";

export default function Card({ 
  children, 
  className = "" }) {
  return (
    <div className={` rounded-md shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
