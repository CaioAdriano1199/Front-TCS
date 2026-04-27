"use client";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    async function carregar() {
      const dados = await receberarquivos();
      const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
        ...p,
        tipo: "pasta",
        dataUpload: p.dataCriacao
      }));

      const arquivosFormatados = (dados.arquivos || []).map((a) => ({
        ...a,
        tipo: "arquivo",
        dataUpload: a.dataUpload
      }));

      setListaArquivos([...subpastasFormatadas, ...arquivosFormatados]);
    }

    async function carregarEquipes() {
      const dados = await receberEquipes();
      setListaEquipes(dados);
    }

    carregar();
    carregarEquipes();


    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("admin") === "true";
      setIsAdmin(adminStatus);
    }
  }, []);

  return (
    <>
      <div className="w-64 h-screen bg-[var(--bgbutton)] text-white flex flex-col">
        <h1 className="p-4 text-[var(--branco)] text-2xl font-bold">
          Relic
        </h1>
        <div className="mt-4 flex items-start px-4 py-2">
        <i className="bi bi-folder"></i>
        <h1 className="text-xl text-[var(--branco)] font-bold px-1">Documentos</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col mt-4">
          {listaArquivos.map((arquivo) => (
            <a key={arquivo.id} className="cursor-pointer text-[var(--branco)] px-4 py-2 hover:bg-gray-700">
              {arquivo.nome}
            </a>
          ))}
        </nav>
        <ArquivoModals listaArquivos={listaArquivos} setListaArquivos={setListaArquivos} isOpen={modalArquivoAberto} onClose={() => setModalArquivoAberto(false)} onOpen={() => setModalArquivoAberto(true)} />
       </div>
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
