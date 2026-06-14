"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { respostadaia } from "../servico/respostadaia";
import { downloadArquivo } from "../servico/downloadarquivo";

export default function ChatCont() {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState("");
  const [primeiraMensagem, setPrimeiraMensagem] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

async function baixarArquivo(documento) {
  try {
    const path =
      documento?.path ||
      documento?.arquivo_path ||
      documento?.filePath;

    if (!path) {
      toast.error("Arquivo não encontrado.");
      return;
    }

    const {
      blob,
      contentDisposition
    } = await downloadArquivo(path);

    let nomeArquivo =
      documento?.arquivo_nome ||
      documento?.nome ||
      "arquivo";

    const match = contentDisposition.match(
      /filename="?([^"]+)"?/
    );

    if (match?.[1]) {
      nomeArquivo = match[1];
    }

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = nomeArquivo;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.URL.revokeObjectURL(url);

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
    setLoading(true);
    setError(null);

    let toastId;
    try {
      toastId = toast.loading("Buscando resposta...");
      const resposta = await respostadaia(textoenviado);

      // Normaliza possíveis formatos de resposta da API
      const textoResposta = resposta?.answer || resposta?.text || resposta?.answerText || resposta?.result || (typeof resposta === 'string' ? resposta : null) || "Nenhuma resposta encontrada";

      const documentosResposta = resposta?.sources || resposta?.documents || resposta?.results?.sources || resposta?.data?.sources || [];

      // Se não houver texto da IA, usar trecho(s) dos documentos como fallback
      let textoFinal = textoResposta;
      if ((!textoFinal || String(textoFinal).trim() === "") && Array.isArray(documentosResposta) && documentosResposta.length > 0) {
        const textosDocs = documentosResposta
          .map(d => d.chunk_text || d.chunkText || d.text || d.content || d.arquivo_nome)
          .filter(Boolean);

        if (textosDocs.length > 0) {
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
      toast.dismiss(toastId);
    } catch (err) {
      console.error("Erro ao obter resposta da IA:", err);
      setError("Não foi possível buscar a resposta. Tente novamente.");
      const novaMensagemErro = {
        id: crypto.randomUUID(),
        texto: "Não foi possível buscar a resposta.",
        autor: "ia",
        documentos: []
      };
      setMensagens((prev) => [...prev, novaMensagemErro]);
      // dismiss loading toast and show error
      if (toastId) toast.dismiss(toastId);
      toast.error("Não foi possível buscar a resposta.");
    } finally {
      setLoading(false);
    }
  }

  return (

    <div className="flex text-black flex-col min-h-screen w-full p-4 md:p-6 max-w-3xl mx-auto overflow-hidden">

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
                if (loading) return;
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
                if (loading) return;
                setPrimeiraMensagem(false);
                enviarMensagem();
              }}
              disabled={loading}
              className={`px-3 rounded-full transition-colors duration-300 ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[var(--bgbutton)] text-[var(--branco)] hover:bg-[var(--bgbuttonhover)] hover:cursor-pointer'}`}
            >
              {loading ? <i className="bi bi-arrow-repeat animate-spin"></i> : <i className="bi bi-send"></i>}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 📩 Lista de mensagens */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            {error && (
              <div className="text-red-600 bg-red-100 p-2 rounded mb-2">{error}</div>
            )}
            <div className="w-full flex-1 overflow-y-auto pr-2">
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
                if (loading) return;
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
              onClick={() => { if (!loading) enviarMensagem(); }}
              disabled={loading}
              className={`rounded-full px-3 transition-colors duration-300 ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[var(--bgbutton)] text-white hover:bg-[var(--bgbuttonhover)] hover:cursor-pointer'}`}
            >
              {loading ? <i className="bi bi-arrow-repeat animate-spin"></i> : <i className="bi bi-send"></i>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}