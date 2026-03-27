"use client";

import { useState } from "react";

export default function ChatCont() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");

  function enviarMensagem() {
    if (texto.trim() === "") return;

    const novaMensagem = {
      id: Date.now(),
      texto: texto,
      autor: "eu"
    };

    setMensagens([...mensagens, novaMensagem]);
    setTexto("");
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-200 p-4">

      {/* 📩 Lista de mensagens */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${
              msg.autor === "eu"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white text-black"
            }`}
          >
            {msg.texto}
          </div>
        ))}
      </div>

      {/* ✍️ Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite uma mensagem..."
          className="flex-1 p-2 rounded border"
        />

        <button
          onClick={enviarMensagem}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}