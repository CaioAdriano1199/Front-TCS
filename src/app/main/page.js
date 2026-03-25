"use client";

import { useRef, useState } from "react";
import Card from "../componentes/card/card";
import Sidemenu from "../componentes/sidemenu/sidemenu";

export default function Main() {
  const [arquivo, setArquivo] = useState(null);
  const inputRef = useRef(null);

  function abrirSeletor() {
    inputRef.current.click();
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    setArquivo(file);
  }

  return (
    <main className="flex min-h-screen bg-white">
      <Sidemenu className="flex-1" />
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
          <button className="flex-1 bg-gray-500 hover:bg-gray-400 hover:cursor-pointer w-full h-full rounded-md max-w-1/2">
            <h1 className="p-8">Selecionar arquivo</h1>
            <i className="bi bi-file-earmark text-8xl"></i>
          </button>
        </div>

      </Card>
    </main>
  );
}
