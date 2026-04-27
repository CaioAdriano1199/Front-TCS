"use client";
import { useState, useRef } from "react";
import Modal from "../modal/modal";
import ActionMenu from "../menudeacao/menudeacao";
import { receberarquivos } from "../servico/receberarquivos";
import { receberPastasRaiz } from "../servico/receberpastasraiz";

export default function ArquivoModals({ listaArquivos, setListaArquivos, isOpen, onClose, onOpen }) {
  const [historicoPastas, setHistoricoPastas] = useState([]);
  const [listaPastasRaiz, setListaPastasRaiz] = useState([]);
  const [modalArquivo, setmodalArquivo] = useState(false);
  const [modalNovapasta, setmodalNovaPasta] = useState(false);
  const [subpastas, setSubpastas] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [arquivosPasta, setArquivosPasta] = useState([]);
  const [arquivonovo, setArquivonovo] = useState(null);
  const [ordemDesc, setOrdemDesc] = useState(true);
  const [tipoOrdenacao, setTipoOrdenacao] = useState("data");
  const [tipomodalarquivos, setTipomodalarquivos] = useState("lista");
  const inputRef = useRef(null);
  const [ordem, setOrdem] = useState("asc");

  async function abrirPastasRaiz() {
    const dados = await receberPastasRaiz();
    setListaPastasRaiz(dados);
    setTipomodalarquivos("raiz");
    onOpen();
  }

  async function mostrarArquivosPasta(pasta) {
    const dados = await receberarquivos(pasta.id);

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

    const tudo = [...subpastasFormatadas, ...arquivosFormatados];

    setHistoricoPastas((prev) => [...prev, pasta]);

    setListaArquivos(tudo);
    setTipomodalarquivos("pastaprincipal");
  }

  async function voltarPasta() {
    const novoHistorico = [...historicoPastas];
    novoHistorico.pop();

    const pastaAnterior = novoHistorico[novoHistorico.length - 1];

    setHistoricoPastas(novoHistorico);

    if (!pastaAnterior) {
      abrirPastasRaiz();
      return;
    }

    const dados = await receberarquivos(pastaAnterior.id);

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

  function abrirSeletor() {
    inputRef.current.click();
  }

  function handleUpload(event) {
    const file = event.target.files[0];
    setArquivonovo(file);
  }

  const raizordenada = [...listaPastasRaiz].sort((a, b) => {
    const nomeA = (a.nome || "").toLowerCase();
    const nomeB = (b.nome || "").toLowerCase();
    if (ordem === "asc") {
      return nomeA.localeCompare(nomeB);
    }

    return nomeB.localeCompare(nomeA);
  });

  const arquivosOrdenados = [...listaArquivos].sort((a, b) => {
    if (a.tipo !== b.tipo) {
      return a.tipo === "pasta" ? -1 : 1;
    }

    if (tipoOrdenacao === "data") {
      const dataA = new Date(a.dataUpload || 0);
      const dataB = new Date(b.dataUpload || 0);

      return ordemDesc
        ? dataB - dataA
        : dataA - dataB;
    }

    if (tipoOrdenacao === "nome") {
      const nomeA = (a.nome || "").toLowerCase();
      const nomeB = (b.nome || "").toLowerCase();

      return ordemDesc
        ? nomeB.localeCompare(nomeA)
        : nomeA.localeCompare(nomeB);
    }

    return 0;
  });

  return (
    <>
      <div className="px-4 py-2 hover:bg-[var(--bgbuttonhover)] cursor-pointer flex items-center" onClick={abrirPastasRaiz}>
        <i className="bi bi-plus"></i>
        <a className=" text-[var(--branco)] px-1 ">Mais arquivos...</a>
      </div>

      <Modal //modal de arquivos
        isOpen={isOpen}
        onClose={onClose}
        className=" m-90 max-h-2/3 overflow-y-auto"
        width="w-full h-full">
        <div className="p-4">
          {tipomodalarquivos === "raiz" && ( //modal de pastas raiz
            <>
              <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>
              <div className="my-4">
                <button onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}
                  
                 className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold">{ordem === "asc" ? <i className="bi bi-sort-alpha-down-alt"></i> : <i className="bi bi-sort-alpha-up-alt"></i>}  Ordenar por nome</p></button>
              </div>
              <div className="w-full mx-auto overflow-y-auto max-h-96">
                {raizordenada.map((arquivo) => (
                  <div className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]"
                    key={arquivo.id}>
                    <div className="flex-2 flex justify-between items-center"
                      onClick={() => mostrarArquivosPasta(arquivo)}>
                      <p className="font-medium"><i className="bi bi-folder px-1"></i>
                        {arquivo.nome}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tipomodalarquivos === "pastaprincipal" && ( //modal de arquivos principais
            <>
              <button onClick={() => voltarPasta()}>
                ← Voltar
              </button>
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>
                <div className="my-4">
                  <button onClick={() => setmodalNovaPasta(true)} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-folder"></i> Nova pasta</p></button>
                  <button onClick={() => abrirSeletor()} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-file-earmark"></i> Novo arquivo</p></button>
                  <button onClick={() => {
                    setTipoOrdenacao("nome");
                    setOrdemDesc(!ordemDesc);
                  }} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-sort-alpha-down-alt"></i> Ordenar por nome</p></button>
                  <button onClick={() => {
                    setTipoOrdenacao("data");
                    setOrdemDesc(!ordemDesc);
                  }} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-sort-down-alt"></i> Ordenar por data</p></button>
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={handleUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="w-full mx-auto overflow-y-auto max-h-96">
                {arquivosOrdenados.map((arquivo) => (
                  <div className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]"

                    key={arquivo.id}>
                    <div className="flex-2 flex justify-between items-center"
                      onClick={
                        arquivo.tipo === "pasta"
                          ? () => mostrarArquivosPasta(arquivo)
                          : undefined
                      }>
                      <p
                      >
                        {arquivo.tipo === "arquivo" ? (
                          <i className="bi bi-file-earmark"></i>
                        ) : (
                          <i className="bi bi-folder"></i>
                        )}
                        {arquivo.nome}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(arquivo.dataUpload).toLocaleString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(",", "")}</p>
                    </div>
                    <ActionMenu className="flex-1"
                      options={[
                        {
                          label: "Editar",
                          onClick: () => { }
                        },
                        {
                          label: "Excluir",
                          onClick: () => { }
                        }
                      ]}
                    />

                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal //modal para criar nova pasta
        isOpen={modalNovapasta}
        onClose={() => setmodalNovaPasta(false)}
        className="text-black">
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova pasta" className="border p-2 w-full mb-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar pasta</button>
        </div>
      </Modal>
    </>
  );
}