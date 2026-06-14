"use client";

import { useRef, useState, useEffect } from "react";
import Card from "../card/card";
import Sidemenu from "../sidemenu/sidemenu";
import Modal from "../modal/modal";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";

export default function StartContent() {
      const [arquivonovo, setArquivonovo] = useState(null);
  const inputRef = useRef(null);
  const [modalArquivo, setmodalArquivo] =useState(false);
  const [listaArquivos, setListaArquivos] = useState([]);


  


  function abrirSeletor() {
    inputRef.current.click();
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    setArquivonovo(file);
  }

useEffect(() => {
  async function carregar() {
    const equipes = await receberEquipes();
    const rootPath = (equipes?.[0]?.caminho || equipes?.[0]?.caminhoBase || equipes?.[0]?.path || "");
    const dados = await receberarquivos(rootPath);
    setListaArquivos(Array.isArray(dados) ? dados : dados.arquivos || []);
  }

  carregar();
}, []);
    return(
        <>
           <Card className="flex-1 flex flex-col bg-[var(--branco)] items-center justify-center w-full m-6 p-4 md:p-6">
        <input
          type="file"
          ref={inputRef}
          onChange={handleUpload}
          className="hidden"
        />


        <div className="flex flex-col md:flex-row text-2xl font-bold w-full h-full justify-between text-[var(--preto)] gap-4">
          <button className="flex-1 bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] text-[var(--branco)] hover:cursor-pointer rounded-md min-h-[12rem] flex flex-col items-center justify-center gap-3 p-6"
            onClick={abrirSeletor}>
            <h1 className="text-lg font-semibold">Adicionar arquivo</h1>
            <i className="bi bi-file-earmark-arrow-up text-7xl"></i>
          </button>
          <button className="flex-1 bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] text-[var(--branco)] hover:cursor-pointer rounded-md min-h-[12rem] flex flex-col items-center justify-center gap-3 p-6"
          onClick={() => setmodalArquivo(true)}>
            <h1 className="text-lg font-semibold">Selecionar arquivo</h1>
            <i className="bi bi-file-earmark text-7xl"></i>
          </button>
        </div>

      </Card>
      <Modal 
              isOpen={modalArquivo}
        onClose={() => setmodalArquivo(false)}
        title="Meu Modal"
        className="text-black">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>
          </div>
          <ul className="list-disc pl-5">
            {listaArquivos.map((arquivo) => (
              <li key={arquivo.id}>{arquivo.nome}</li>
            ))}
          </ul>
        </div>
      </Modal>
      </>
    );
}