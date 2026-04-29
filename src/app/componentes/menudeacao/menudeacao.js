import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ActionMenu({ options = [] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function toggleMenu(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    });

    setOpen((prev) => !prev);
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Botão */}
      <i
        onClick={toggleMenu}
        className="p-2 rounded hover:text-[var(--branco)] hover:cursor-pointer bi bi-three-dots-vertical"></i>


      {/* Menu */}
      {open &&
        createPortal(
          <div
            className="fixed w-40 bg-white border rounded shadow-lg z-50"
            style={{
              top: position.top,
              left: position.left - 160, // ajusta pra não sair da tela
            }}
          >
            {options.map((opt, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  opt.onClick();
                  setOpen(false);
                }}
                className="w-full text-black text-left px-4 py-2 hover:bg-gray-100"
              >
                {opt.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}