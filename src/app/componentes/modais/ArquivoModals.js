"use client";
import { useState, useRef, useEffect } from "react";
import Modal from "../modal/modal";
import ActionMenu from "../menudeacao/menudeacao";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { criarPasta } from "../servico/criarpasta";
import toast from "react-hot-toast";
import { uploadArquivo } from "../servico/uploadarquivo";
import { downloadArquivo } from "../servico/downloadarquivo";

export default function ArquivoModals({ listaArquivos, setListaArquivos, isOpen, onClose, onOpen, caminhoBase, modalLoading = false }) {
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
  const [nomepasta, setNomePasta] = useState("");
  const [modalRenomearpasta, setmodalRenomearPasta] = useState(false);
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isOpen) {
      setTipomodalarquivos("lista");
      return;
    }

    if (listaArquivos && listaArquivos.length > 0) {
      setTipomodalarquivos("pastaprincipal");
    }
  }, [isOpen, listaArquivos]);

  // Funcionalidade de renomear pasta desabilitada
  // async function renomearpasta() {
  //   const dados = await receberarquivos(historicoPastas[historicoPastas.length - 1].id);
  //   const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
  //     ...p,
  //     tipo: "pasta",
  //     dataUpload: p.dataCriacao
  //   }));
  // }

  async function abrirPastasRaiz() {
    const dados = await receberEquipes();
    const equipesFormatadas = (dados || []).map((equipe) => ({
      id: equipe.id,
      nome: equipe.nomeEmpresa || equipe.nome,
      path: equipe.caminho || equipe.caminhoBase || equipe.path
    }));

    setListaPastasRaiz(equipesFormatadas);
    setTipomodalarquivos("raiz");
    onOpen();
  }

  // Faz download direto a partir do modal usando o serviço downloadArquivo
  async function downloadDirect(path, nome) {
    if (!path) {
      toast.error("Caminho de download não informado.");
      return;
    }

    try {
      const { blob, contentDisposition } = await downloadArquivo(path);
      let fileName = nome || "arquivo";

      const match = contentDisposition?.match(/filename\*?=(?:UTF-8''")?"?([^";]+)"?/i);
      if (match?.[1]) {
        fileName = decodeURIComponent(match[1]);
      }

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      toast.error("Não foi possível baixar o arquivo.");
    }
  }

  // Funcionalidade de criar nova pasta desabilitada
  // async function criarNovaPasta() {
  //   if (!nomepasta.trim()) {
  //     toast.error("Informe um nome para a nova pasta.");
  //     return;
  //   }
  //   ...
  // }

  async function mostrarArquivosPasta(pasta) {
    if (!pasta?.path) return;

    const dados = await receberarquivos(pasta.path);
    const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
      ...p,
      nome: p.name || p.nome,
      tipo: "pasta",
      dataUpload: p.dataCriacao
    }));

    const arquivosFormatados = (dados.arquivos || []).map((a) => ({
      ...a,
      nome: a.name || a.nome,
      tipo: "arquivo",
      dataUpload: a.date
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

    const dados = await receberarquivos(pastaAnterior.path);

    const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
      ...p,
      nome: p.name || p.nome,
      tipo: "pasta",
      dataUpload: p.date
    }));

    const arquivosFormatados = (dados.arquivos || []).map((a) => ({
      ...a,
      nome: a.name || a.nome,
      tipo: "arquivo",
      dataUpload: a.date
    }));

    setListaArquivos([...subpastasFormatadas, ...arquivosFormatados]);
  }

  function abrirSeletor() {
    inputRef.current?.click();
  }

  async function recarregarPastaAtual() {
    const caminhoAtual = historicoPastas[historicoPastas.length - 1]?.path || caminhoBase;
    if (!caminhoAtual) return;

    const dados = await receberarquivos(caminhoAtual);

    const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
      ...p,
      nome: p.name || p.nome,
      tipo: "pasta",
      dataUpload: p.dataCriacao
    }));

    const arquivosFormatados = (dados.arquivos || []).map((a) => ({
      ...a,
      nome: a.name || a.nome,
      tipo: "arquivo",
      dataUpload: a.date
    }));

    setListaArquivos([...subpastasFormatadas, ...arquivosFormatados]);
  }

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const caminhoAtual = historicoPastas[historicoPastas.length - 1]?.path || caminhoBase;
    if (!caminhoAtual) {
      toast.error("Abra uma pasta antes de enviar um arquivo.");
      return;
    }

    try {
      setEnviandoArquivo(true);
      await uploadArquivo(caminhoAtual, file);
      await recarregarPastaAtual();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      toast.error("Não foi possível enviar o arquivo.");
    } finally {
      setEnviandoArquivo(false);
    }
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Lista de Arquivos"
        className=" m-90 max-h-2/3"
        width="w-full"
      >
        <div className="p-4 relative">
          {modalLoading ? (
            <div className="w-full h-48 flex items-center justify-center">
              <i className="bi bi-arrow-repeat animate-spin text-4xl text-[var(--bgbutton)]"></i>
            </div>
          ) : (
            <>
              {tipomodalarquivos === "raiz" && (
                <>
                  <div className="my-4">
                    <button
                      onClick={() => setOrdem(ordem === "asc" ? "desc" : "asc")}
                      className="my-4 mr-4 cursor-pointer"
                    >
                      <p className="text-m font-semibold">
                        {ordem === "asc" ? (
                          <i className="bi bi-sort-alpha-down-alt"></i>
                        ) : (
                          <i className="bi bi-sort-alpha-up-alt"></i>
                        )}
                        Ordenar por nome
                      </p>
                    </button>
                  </div>
                  <div className="w-full mx-auto overflow-y-auto max-h-[60vh]">
                    {raizordenada.map((arquivo) => (
                      <div
                        className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]"
                        key={arquivo.path}
                      >
                        <div
                          className="flex-2 flex justify-between items-center"
                          onClick={() => mostrarArquivosPasta(arquivo)}
                        >
                          <p className="font-medium">
                            <i className="bi bi-folder px-1"></i>
                            {arquivo.nome}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tipomodalarquivos === "pastaprincipal" && (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <button onClick={() => voltarPasta()}>
                      <i className="bi bi-arrow-left text-lg hover:cursor-pointer hover:text-[var(--phgray)]"></i>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTipoOrdenacao("nome");
                          setOrdemDesc(!ordemDesc);
                        }}
                        className="my-4 mr-4 cursor-pointer"
                      >
                        <p className="text-m font-semibold">
                          {ordemDesc === true ? (
                            <i className="bi bi-sort-alpha-down-alt"></i>
                          ) : (
                            <i className="bi bi-sort-alpha-up-alt"></i>
                          )}
                          Ordenar por nome
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setTipoOrdenacao("data");
                          setOrdemDesc(!ordemDesc);
                        }}
                        className="my-4 mr-4 cursor-pointer"
                      >
                        <p className="text-m font-semibold">
                          {ordemDesc === true ? (
                            <i className="bi bi-sort-down-alt"></i>
                          ) : (
                            <i className="bi bi-sort-up-alt"></i>
                          )}
                          Ordenar por data
                        </p>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={abrirSeletor}
                      disabled={enviandoArquivo}
                      className={`ml-auto my-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${enviandoArquivo ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[var(--bgbutton)] text-[var(--branco)] hover:bg-[var(--bgbuttonhover)] cursor-pointer"}`}
                    >
                      {enviandoArquivo ? (
                        <i className="bi bi-arrow-repeat animate-spin"></i>
                      ) : (
                        <i className="bi bi-upload"></i>
                      )}
                      Enviar arquivo
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={inputRef}
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <div className="w-full mx-auto overflow-y-auto max-h-96">
                    {arquivosOrdenados.map((arquivo) => (
                      <div
                        className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]"
                        key={arquivo.path}
                      >
                        <div
                          className="flex-2 flex justify-between items-center"
                          onClick={
                            arquivo.tipo === "pasta"
                              ? () => mostrarArquivosPasta(arquivo)
                              : () =>
                                  downloadDirect(
                                    arquivo.path || arquivo.caminho || arquivo.arquivo_path || arquivo.filePath,
                                    arquivo.nome || arquivo.name || arquivo.arquivo_nome
                                  )
                          }
                        >
                          <p>
                            {arquivo.tipo === "arquivo" ? (
                              <i className="bi bi-file-earmark"></i>
                            ) : (
                              <i className="bi bi-folder"></i>
                            )}
                            {arquivo.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {arquivo.dataUpload
                              ? new Date(arquivo.dataUpload).toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).replace(",", "")
                              : "-"}
                          </p>
                        </div>
                        {/* ActionMenu desabilitado */}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
      {/* Modais desabilitados: Nova Pasta e Renomear Pasta */}
    </>
  );
}
