"use client";

import { useState } from "react";
import { respostadaia } from "../servico/respostadaia";

export default function ChatCont() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [primeiraMensagem, setPrimeiraMensagem] = useState(true);

  async function baixarArquivo(documento) {
    if (!documento?.document_id) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/arquivos/download/${documento.document_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao baixar arquivo: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = documento.arquivo_nome || documento.nome || "arquivo";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }
  }

  async function enviarMensagem() {
    if (texto.trim() === "") return;

    const novaMensagem = {
      id: crypto.randomUUID(),
      texto: texto,
      autor: "eu"
    };

    setMensagens((prev) => [...prev, novaMensagem]);

    const textoenviado = texto;

    setTexto("");

    try {
      const resposta = await respostadaia(textoenviado);

      const primeiroDocumento = resposta.documents[0];

      const novaMensagemIA = {
        id: crypto.randomUUID(),
        texto:
          primeiroDocumento?.arquivo_nome ||
          "Nenhum documento encontrado",
        autor: "ia",

        documento: primeiroDocumento
      };

      setMensagens((prev) => [...prev, novaMensagemIA]);

    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
    }
  }

  return (

    <div className="flex text-black flex-col min-h-screen w-full p-4 md:p-6 max-w-full mx-auto">

      {primeiraMensagem ? (

        <div className="flex flex-col flex-1 items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">
            Bem-vindo ao Relic! Envie sua primeira mensagem para começar.
          </h1>
          <div className="flex gap-2 w-full">
            <textarea
              type="text"
              value={texto}
              rows={1}

              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setPrimeiraMensagem(false);
                  enviarMensagem();
                }
              }}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="resize-none flex-1 p-2 rounded-xl border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] bg-[var(--branco)] resize-none"
            />
            <button
              onClick={() => {
                setPrimeiraMensagem(false);
                enviarMensagem();
              }}
              className="bg-[var(--bgbutton)] text-[var(--branco)] px-3 rounded-full hover:bg-[var(--bgbuttonhover)] transition-colors duration-300 hover:cursor-pointer"
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 📩 Lista de mensagens */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto mb-4">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] md:max-w-[60%] p-3 rounded-lg whitespace-pre-wrap ${msg.autor === "eu"
                      ? "bg-[var(--bgbuttonhover)] text-white self-end ml-auto"
                      : "bg-white text-black"
                    }`}
                >
                  {msg.documento ? (
                    <button
                      type="button"
                      onClick={() => baixarArquivo(msg.documento)}
                      className="text-left text-[var(--bgbutton)] underline break-all flex items-center gap-1"
                    >
                      <i className="bi bi-file-earmark-text"></i>
                      {msg.texto}
                    </button>
                  ) : (
                    msg.texto
                  )}
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
                className="flex-1 p-2 rounded border-transparent focus:ring-[var(--bgbutton)] bg-[var(--branco)] resize-none"
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