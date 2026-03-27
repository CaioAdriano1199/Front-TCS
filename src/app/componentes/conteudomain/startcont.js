"use client";

import { useRef, useState, useEffect } from "react";
import Card from "../card/card";
import Sidemenu from "../sidemenu/sidemenu";
import Modal from "../modal/modal";
import { receberarquivos } from "../servico/receberarquivos";

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
    const dados = await receberarquivos();
    setListaArquivos(dados);
  }

  carregar();
}, []);
    return(
        <>
           <Card className="flex-1 flex flex-col bg-gray-300 items-center justify-center w-full m-25">
        <input
          type="file"
          ref={inputRef}
          onChange={handleUpload}
          className="hidden"
        />


        <div className="flex flex-row text-2xl font-bold w-full h-full justify-between text-black gap-8">
          <button className=" flex-1 bg-gray-500 hover:bg-gray-400 hover:cursor-pointer w-full h-full rounded-md max-w-1/2"
            onClick={abrirSeletor}>
            <h1 className="p-8">Adicionar arquivo</h1>
            <i className="bi bi-file-earmark-arrow-up text-8xl"></i>
          </button>
          <button className="flex-1 bg-gray-500 hover:bg-gray-400 hover:cursor-pointer w-full h-full rounded-md max-w-1/2"
          onClick={() => setmodalArquivo(true)}>
            <h1 className="p-8">Selecionar arquivo</h1>
            <i className="bi bi-file-earmark text-8xl"></i>
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