"use client";

export default function Card({ 
  children, 
  className = "",
  bgcor = "bg-white" }) {
  return (
    <div className={`${bgcor} rounded-md shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
