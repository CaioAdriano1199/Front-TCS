"use client";

import { useState } from "react";
import Typewriter from "typewriter-effect";

export default function ChatCont() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [primeiraMensagem, setPrimeiraMensagem] = useState(true);

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

    <div className="flex text-black flex-col h-screen w-full p-4 max-w-3xl mx-auto">

      {primeiraMensagem ? (

        <div className="flex flex-col flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">
            Bem-vindo ao Relic!{" "}
            <span className="inline">
              <Typewriter
                options={{
                  strings: [
                    "Envie sua primeira mensagem para começar.",
                    "O que deseja encontrar?"
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 40,
                  deleteSpeed: 20,
                }}
              />
            </span>
          </h1>
          <div className="flex gap-2 w-full">
            <textarea
              type="text"
              value={texto}
              rows={1}
              resize-none
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setPrimeiraMensagem(false);
                  enviarMensagem();
                }
              }}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 p-2 rounded-xl border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] bg-[var(--bginput)] resize-none"
            />

            <button
              onClick={() => {
                setPrimeiraMensagem(false);
                enviarMensagem();
              }}
              className="bg-blue-500 text-white px-3 rounded-full hover:bg-[var(--bgbuttonhover)] transition-colors duration-300 hover:cursor-pointer"
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      ) :
        (
          <>
            {/* 📩 Lista de mensagens */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 justify-end flex flex-col">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-3 rounded-lg whitespace-pre-wrap ${msg.autor === "eu"
                    ? "bg-[var(--bgbuttonhover)] text-white self-end ml-auto"
                    : "bg-white text-black"
                    }`}
                >
                  {msg.texto}
                </div>
              ))}
            </div>

            {/* ✍️ Input */}
            <div className="flex gap-2">
              <textarea
                type="text"
                value={texto}
                rows={1}

                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensagem();
                  }
                }}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 p-2 rounded border-transparent focus:ring-[var(--bgbutton)] bg-[var(--bginput)] resize-none"
              />

              <button
                onClick={enviarMensagem}
                className="bg-[var(--bgbutton)] text-white rounded-full px-3 hover:bg-[var(--bgbuttonhover)] transition-colors duration-300 hover:cursor-pointer"
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </>
        )}
    </div>
  );
}