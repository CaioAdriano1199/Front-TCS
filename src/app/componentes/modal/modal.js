"use client";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",       
  showCloseButton = true,   
  className = "",           
}) {
  // Fecha o modal ao apertar ESC
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Bloqueia scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full ${width} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-4">
          {title && (
            <h3 className="text-xl text-[var(--azulescuro)] text-center w-full">
              {title}
            </h3>
          )}

          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[var(--azulescuro)] text-xl font-bold hover:text-[var(--azulclaro)] focus:outline-none"
            >
              X
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
