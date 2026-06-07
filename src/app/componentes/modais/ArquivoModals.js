"use client";
import { useState, useRef } from "react";
import Modal from "../modal/modal";
import ActionMenu from "../menudeacao/menudeacao";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { criarPasta } from "../servico/criarpasta";
import toast from "react-hot-toast";
import { uploadArquivo } from "../servico/uploadarquivo";

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
  const [nomepasta, setNomePasta] = useState("");
  const [modalRenomearpasta, setmodalRenomearPasta] = useState(false);

  async function renomearpasta() {
    const dados = await receberarquivos(historicoPastas[historicoPastas.length - 1].id);
    const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
      ...p,
      tipo: "pasta",
      dataUpload: p.dataCriacao
    }));
  }

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

    async function criarNovaPasta() {
      if (!nomepasta.trim()) {
        toast.error("Informe um nome para a nova pasta.");
        return;
      }

      const currentFolder = historicoPastas[historicoPastas.length - 1];
      if (!currentFolder?.path) {
        toast.error("Selecione uma equipe antes de criar uma pasta.");
        return;
      }

      const equipeRootPath = historicoPastas[0]?.path || currentFolder.path;
      const novaPastaData = {
        nome: nomepasta,
        parentPath: currentFolder.path,
        caminhoEquipe: equipeRootPath
      };

      await criarPasta(novaPastaData);
      toast.success("Pasta criada com sucesso!");
      setmodalNovaPasta(false);
      setNomePasta("");

      const dados = await receberarquivos(currentFolder.path);
      const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
        ...p,
        nome: p.name || p.nome,
        tipo: "pasta",
        dataUpload: p.dataCriacao
      }));
      const arquivosFormatados = (dados.arquivos || []).map((a) => ({
        ...a,
        tipo: "arquivo",
        dataUpload: a.dataUpload
      }));
      const tudo = [...subpastasFormatadas, ...arquivosFormatados];
      setListaArquivos(tudo);
    }

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

      const dados = await receberarquivos(pastaAnterior.path);

      const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
        ...p,
        nome: p.name || p.nome,
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


    async function onFileChange(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      const currentFolder = historicoPastas[historicoPastas.length - 1];
      if (!currentFolder?.path) {
        toast.error("Selecione uma pasta antes de enviar o arquivo.");
        return;
      }

      setArquivonovo(file);
      await uploadArquivo(currentFolder.path, file);

      const dados = await receberarquivos(currentFolder.path);
      const subpastasFormatadas = (dados.subpastas || []).map((p) => ({
        ...p,
        nome: p.name || p.nome,
        tipo: "pasta",
        dataUpload: p.dataCriacao
      }));
      const arquivosFormatados = (dados.arquivos || []).map((a) => ({
        ...a,
        tipo: "arquivo",
        dataUpload: a.dataUpload
      }));
      const tudo = [...subpastasFormatadas, ...arquivosFormatados];
      setListaArquivos(tudo);
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
        <Modal //modal de arquivos
          isOpen={isOpen}
          onClose={onClose}
          title="Lista de Arquivos"
          className=" m-90 max-h-2/3 overflow-y-auto"
          width="w-full">
          <div className="p-4">
            {tipomodalarquivos === "raiz" && ( //modal de pastas raiz
              <>
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
                  <i className="bi bi-arrow-left text-lg hover:cursor-pointer hover:text-[var(--phgray)]"></i>
                </button>
                <div className="mb-4">
                  <div className="my-4">
                    <button onClick={() => setmodalNovaPasta(true)} className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold"><i className="bi bi-folder"></i> Nova pasta</p></button>
                    <button onClick={() => abrirSeletor()} className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold"><i className="bi bi-file-earmark"></i> Novo arquivo</p></button>
                    <button onClick={() => {
                      setTipoOrdenacao("nome");
                      setOrdemDesc(!ordemDesc);
                    }} className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold">{ordemDesc === true ? <i className="bi bi-sort-alpha-down-alt"></i> : <i className="bi bi-sort-alpha-up-alt"></i>} Ordenar por nome</p></button>
                    <button onClick={() => {
                      setTipoOrdenacao("data");
                      setOrdemDesc(!ordemDesc);
                    }} className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold">{ordemDesc === true ? <i className="bi bi-sort-down-alt"></i> : <i className="bi bi-sort-up-alt"></i>} Ordenar por data</p></button>
                    <input
                      type="file"
                      ref={inputRef}
                      onChange={onFileChange}
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
          title="Nova Pasta"
          className="text-black">
          <div className="flex flex-col items-center">
            <input type="text" placeholder="Nome da nova pasta" className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] shadow-sm rounded-md p-2 w-full mb-4" value={nomepasta} onChange={(e) => setNomePasta(e.target.value)} />
            <button className="modal-button w-full" onClick={criarNovaPasta}>Criar pasta</button>
          </div>
        </Modal>
        <Modal
          isOpen={modalRenomearpasta}
          onClose={() => setmodalRenomearPasta(false)}
          title="Renomear Pasta"
          className="text-black">
          <div className="flex flex-col items-center">
            <input type="text" placeholder="Nome da pasta" className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] shadow-sm rounded-md p-2 w-full mb-4" value={nomepasta} onChange={(e) => setNomePasta(e.target.value)} />
            <button className="modal-button w-full" onClick={renomearpasta}>Renomear pasta</button>
          </div>
        </Modal>
      </>
    );
  }
