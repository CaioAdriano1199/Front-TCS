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
        className={`relative bg-[var(--branco)] text-[var(--cinzaescuro)] rounded-lg shadow-xl w-full max-w-[95vw] max-h-[90vh] overflow-y-auto ${width} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--cinzaclaro)]">
          {title && (
            <h3 className="text-xl font-semibold text-[var(--cinzaescuro)]">
              {title}
            </h3>
          )}

          {showCloseButton && (
            <button
              onClick={onClose}
              className="flex-shrink-0 text-red-600 text-xl font-bold hover:bg-red-100 rounded p-1 hover:cursor-pointer transition-colors"
              aria-label="Fechar modal"
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
