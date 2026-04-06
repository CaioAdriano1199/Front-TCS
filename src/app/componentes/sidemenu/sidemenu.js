"use client";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Modal from "../modal/modal";

export default function Sidemenu({ setPgc }) {
  const [listaArquivos, setListaArquivos] = useState([]);
  const [listaEquipes, setListaEquipes] = useState([]);
  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [modalArquivo, setmodalArquivo] = useState(false);
  const [modalEquipe, setmodalEquipe] = useState(false);
  const [modalNovapasta, setmodalNovaPasta] = useState(false);
  const [modalNovaEquipe, setmodalNovaEquipe] = useState(false);
  const [modalNovoMembro, setmodalNovoMembro] = useState(false);
  const [modalMembros, setmodalMembros] = useState(false);
  const [modalArquivoPasta, setmodalArquivoPasta] = useState(false);
  const [arquivosPasta, setArquivosPasta] = useState([]);
  const [arquivonovo, setArquivonovo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    async function carregar() {
      const dados = await receberarquivos();
      setListaArquivos(dados);
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

  function mostrarMembros(equipe) {
    setMembrosEquipe(equipe.membros);
    setmodalMembros(true);
  }

  function mostrarArquivosPasta(arquivo) {
    setArquivosPasta(arquivo.arquivos);
    setmodalArquivoPasta(true);
  }

  function abrirSeletor() {
    inputRef.current.click();
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    setArquivonovo(file);
  }

  return (
    <>
      <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">
          Relic
        </div>

        <h1 className="text-xl font-bold mt-4">Documentos</h1>
        <nav className="flex flex-col mt-4">
          {listaArquivos.map((arquivo) => (
            <a key={arquivo.id} className="cursor-pointer px-4 py-2 hover:bg-gray-700">
              {arquivo.nome}
            </a>
          ))}
          <a onClick={() => setmodalArquivo(true)} className="cursor-pointer px-4 py-2 hover:bg-lightgray-700">Mais arquivos...</a>
        </nav>
        <div className="mt-auto p-4 text-sm text-gray-400">
         <button onClick={() => {
            if (isAdmin) {
              setIsAdmin(false);
            } else {
              setIsAdmin(true);
            }
          }}>set admin</button> 
          {isAdmin && (

            <button
              onClick={() => setmodalEquipe(true)}
              className="w-full self-start text-white font-bold py-2 px-4 rounded-md">
              Equipes</button>

          )}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("token");
              }
              redirect("/login");
            }}
            className="w-full self-start text-white font-bold py-2 px-4 rounded-md"
          >
            Sair
          </button>

        </div>
      </div>
      <Modal
        isOpen={modalArquivo}
        onClose={() => setmodalArquivo(false)}
        title="Meu Modal"
        className="text-black m-90 max-h-2/3 overflow-y-auto"
        width="w-full h-full">
        <div className="p-4">
          {!modalArquivoPasta && (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>
                <div className="my-4">
                  <button onClick={() => setmodalNovaPasta(true)} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-folder"></i> Nova pasta</p></button>
                  <button onClick={() => abrirSeletor()} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-folder"></i> Novo arquivo</p></button>
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <ul className="list-disc pl-5">
                {listaArquivos.map((arquivo) => (
                  <li
                    onClick={
                      arquivo.tipo === "pasta"
                        ? () => mostrarArquivosPasta(arquivo)
                        : undefined
                    }
                    key={arquivo.id} className="cursor-pointer">
                    {arquivo.tipo === "arquivo" ? (
                      <i className="bi bi-file-earmark"></i>
                    ) : (
                      <i className="bi bi-folder"></i>
                    )}
                    {arquivo.nome}
                  </li>
                ))}
              </ul>
            </>
          )}
          {modalArquivoPasta && (
            <>
              <button onClick={() => setmodalArquivoPasta(false)}>
                ← Voltar
              </button>
              <h2 className="text-2xl font-bold mb-2">Arquivos na Pasta</h2>
                                <button onClick={() => setmodalNovaPasta(true)} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-folder"></i> Nova pasta</p></button>
                  <button onClick={() => abrirSeletor()} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-folder"></i> Novo arquivo</p></button>
                                    <input
                    type="file"
                    ref={inputRef}
                    onChange={handleUpload}
                    className="hidden"
                  />
              <ul className="list-disc pl-5">
                {arquivosPasta.map((arquivo) => (
                  <li key={arquivo.id}>{arquivo.nome}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={modalEquipe}
        onClose={() => setmodalEquipe(false)}
        className="text-black m-90 max-h-2/3 overflow-y-auto"
        width="w-full h-full">
        <div className="p-4">
          {!modalMembros && (
            <>
              <h2 className="text-2xl font-bold mb-2">Lista de Equipes</h2>
              <div className="my-4">
                <button onClick={() => setmodalNovaEquipe(true)} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-people"></i> Nova equipe</p></button>
              </div>
              <ul className="list-disc pl-5">
                {listaEquipes.map((equipe) => (
                  <li
                    key={equipe.id}
                    className="cursor-pointer"
                    onClick={() => mostrarMembros(equipe)}
                  >
                    <i className="bi bi-people"></i>
                    {equipe.nome}
                  </li>
                ))}
              </ul>
            </>
          )}
          {modalMembros && (
            <>
              <button onClick={() => setmodalMembros(false)}>
                ← Voltar
              </button>

              <h2 className="text-2xl font-bold mb-2 ">Membros</h2>
              <button onClick={() => setmodalNovoMembro(true)} className="my-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-person"></i> Novo membro</p></button>

              <ul className="list-disc pl-5">
                {membrosEquipe.map((membro, index) => (
                  <li key={index}>
                    <i className="bi bi-person"></i> {membro.nome}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalNovaEquipe}
        onClose={() => setmodalNovaEquipe(false)}>
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova equipe" className="border p-2 w-full mb-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar equipe</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalNovapasta}
        onClose={() => setmodalNovaPasta(false)}
        className="text-black">
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova pasta" className="border p-2 w-full mb-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar pasta</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalNovoMembro}
        onClose={() => setmodalNovoMembro(false)}>
        <div className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            className="border text-black bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => compararsenha(e)}
            required
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Cadastrar</button>
        </div>
      </Modal>
    </>

  );
}
