"use client";
import Modal from "../modal/modal";

export default function ModalNovaPasta({
  isOpen,
  onClose
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Nome da nova pasta"
          className="border p-2 w-full mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Criar pasta
        </button>
      </div>
    </Modal>
  );
}