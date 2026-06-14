"use client";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import EquipeModals from "../modais/EquipeModals";
import ArquivoModals from "../modais/ArquivoModals";

export default function Sidemenu({ setPgc }) {
  const [listaArquivos, setListaArquivos] = useState([]);
  const router = useRouter();
  const URL_BASE = process.env.NEXT_PUBLIC_BASE_URL;
  const [listaEquipes, setListaEquipes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalEquipeAberto, setModalEquipeAberto] = useState(false);
  const [modalArquivoAberto, setModalArquivoAberto] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  async function abrirArquivosDaEquipe(equipe) {
    const path = equipe.caminho || equipe.caminhoBase || equipe.path;
    if (!path) return;

    setModalArquivoAberto(true);
    setModalLoading(true);
    try {
      const dados = await receberarquivos(path);
      const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
        ...p,
        nome: p.name || p.nome,
        tipo: "pasta",
        dataUpload: p.dataCriacao || p.date
      }));

      const arquivosFormatados = (dados.arquivos || []).map((a) => ({
        ...a,
        nome: a.name || a.nome,
        tipo: "arquivo",
        dataUpload: a.date || a.dataCriacao
      }));

      setListaArquivos([...subpastasFormatadas, ...arquivosFormatados]);
    } catch (err) {
      console.error("Erro ao carregar arquivos da equipe:", err);
      toast.error('Erro ao carregar arquivos.');
    } finally {
      setModalLoading(false);
    }
  }

  useEffect(() => {
    async function carregarEquipes() {
      const dados = await receberEquipes();
      setListaEquipes(dados);
    }

    carregarEquipes();


    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("admin") === "true";
      setIsAdmin(adminStatus);
    }
  }, []);

  return (
    <>
      <div className="w-full md:w-64 md:h-screen bg-[var(--bgbutton)] text-white flex flex-col">
        <h1 className="p-4 text-[var(--branco)] text-2xl font-bold">
          Relic
        </h1>
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-lg text-[var(--branco)] font-bold mb-3">Documentos</h2>
            <div className="space-y-2">
              {listaEquipes.map((equipe) => (
                <button
                  key={equipe.id}
                  onClick={() => abrirArquivosDaEquipe(equipe)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-[var(--bgbuttonhover)] transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <i className="bi bi-folder"></i>
                  <span className="truncate">{equipe.nomeEmpresa || equipe.nome}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <ArquivoModals listaArquivos={listaArquivos} setListaArquivos={setListaArquivos} isOpen={modalArquivoAberto} onClose={() => setModalArquivoAberto(false)} onOpen={() => setModalArquivoAberto(true)} modalLoading={modalLoading} />
        <div className="mt-auto text-sm py-2 text-gray-400">
          <EquipeModals URL_BASE={URL_BASE} isAdmin={isAdmin} listaEquipes={listaEquipes} setListaEquipes={setListaEquipes} isOpen={modalEquipeAberto} onClose={() => setModalEquipeAberto(false)} onOpen={() => setModalEquipeAberto(true)} />
          
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.clear();
              }
              router.push("/login");
            }}
            className="w-full self-start text-[var(--branco)] font-bold py-2 hover:bg-[var(--bgbuttonhover)] hover:cursor-pointer"
          >
            <div className="flex justify-center p-2">
           <i className="bi bi-box-arrow-left"></i> <p className="px-1"> Sair</p>
           </div>
          </button>

        </div>
      </div>
    </>
  );
}
