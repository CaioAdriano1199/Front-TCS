"use client";

import { useState } from "react";
import { respostadaia } from "../servico/respostadaia";

export default function ChatCont() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [primeiraMensagem, setPrimeiraMensagem] = useState(true);

  async function baixarArquivo(documento) {
    try {
      // Prioriza path (como o modal): path, arquivo_path ou filePath
      const path = documento?.path || documento?.arquivo_path || documento?.filePath;

      if (path) {
        const url = `http://localhost:8081/arquivos/download?path=${encodeURIComponent(path)}`;
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.download = documento.arquivo_nome || documento.nome || "arquivo";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        return;
      }

      // Fallback: se não houver path, tenta usar download_url ou o comportamento anterior via API
      const token = localStorage.getItem("token");
      let urlFallback;
      if (documento?.download_url) {
        urlFallback = `${process.env.NEXT_PUBLIC_API_URL}${documento.download_url}`;
      } else {
        console.error("Caminho do arquivo não encontrado para download.");
        return;
      }

      const response = await fetch(urlFallback, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`
        }
      });

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

      // Normaliza possíveis formatos de resposta da API
      const textoResposta = resposta?.answer || resposta?.text || resposta?.answerText || resposta?.result || (typeof resposta === 'string' ? resposta : null) || "Nenhuma resposta encontrada";

      const documentosResposta = resposta?.sources || resposta?.documents || resposta?.results?.sources || resposta?.data?.sources || [];

      // Se não houver texto da IA, usar trecho(s) dos documentos como fallback
      let textoFinal = textoResposta;
      if ((!textoFinal || String(textoFinal).trim() === "") && Array.isArray(documentosResposta) && documentosResposta.length > 0) {
        const textosDocs = documentosResposta
          .map(d => d.chunk_text || d.chunkText || d.text || d.content || d.arquivo_nome || d.arquivo_nome)
          .filter(Boolean);

        if (textosDocs.length > 0) {
          // usar primeiro trecho e truncar para 1200 caracteres
          textoFinal = textosDocs.join('\n\n').slice(0, 1200) + (textosDocs.join('\n\n').length > 1200 ? '...' : '');
        }
      }

      const novaMensagemIA = {
        id: crypto.randomUUID(),
        texto: textoFinal || "Nenhuma resposta encontrada",
        autor: "ia",
        documentos: Array.isArray(documentosResposta) ? documentosResposta : []
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
              placeholder="Localize o relatório de alta da UTI da semana passada..."
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
          <div className="flex flex-1 flex-col gap-3 overflow-hidden mb-4">
            <div className="w-full overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[80%] md:max-w-[60%] p-3 rounded-lg whitespace-pre-wrap ${msg.autor === "eu"
                    ? "bg-[var(--bgbuttonhover)] text-white self-end ml-auto"
                    : "bg-white text-black"
                    }`}
                >
                  <>
                    <p>{msg.texto}</p>

                    {msg.documentos?.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {msg.documentos.map((doc, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => baixarArquivo(doc)}
                            className="text-left text-[var(--bgbutton)] underline break-all flex items-center gap-1"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                            {doc.arquivo_nome}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                </div>
              ))}
            </div>
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