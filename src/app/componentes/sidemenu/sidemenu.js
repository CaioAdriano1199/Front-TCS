"use client";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "../modal/modal";
import toast from "react-hot-toast";
import ActionMenu from "../menudeacao/menudeacao";
import { receberPastasRaiz } from "../servico/receberpastasraiz";
import { criarEquipe } from "../servico/criarequipe";

export default function Sidemenu({ setPgc }) {
  const [listaArquivos, setListaArquivos] = useState([]);
  const [historicoPastas, setHistoricoPastas] = useState([]);
  const [listaPastasRaiz, setListaPastasRaiz] = useState([]);
  const router = useRouter();
  const URL_BASE = process.env.NEXT_PUBLIC_BASE_URL;
  const [listaEquipes, setListaEquipes] = useState([]);
  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [modalArquivo, setmodalArquivo] = useState(false);
  const [modalEquipe, setmodalEquipe] = useState(false);
  const [modalNovapasta, setmodalNovaPasta] = useState(false);
  const [modalNovaEquipe, setmodalNovaEquipe] = useState(false);
  const [modalNovoMembro, setmodalNovoMembro] = useState(false);
  const [modalMembros, setmodalMembros] = useState(false);
  const [subpastas, setSubpastas] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [modalMoverMembro, setmodalMoverMembro] = useState(false);
  const [modalEditarMembro, setmodalEditarMembro] = useState(false);
  const [arquivosPasta, setArquivosPasta] = useState([]);
  const [arquivonovo, setArquivonovo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailAtt, setEmailAtt] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaAtt, setSenhaAtt] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nomeAtt, setNomeAtt] = useState("");
  const [ordemDesc, setOrdemDesc] = useState(true);
  const [busca, setBusca] = useState("");
  const [tipoOrdenacao, setTipoOrdenacao] = useState("data");
  const [membro, setMembro] = useState({});
  const [equipeSelecionada, setEquipeSelecionada] = useState([]);
  const [tipomodalarquivos, setTipomodalarquivos] = useState("lista");
  const [nomeNovaEquipe, setNomeNovaEquipe] = useState("");
  const colaboradorAtt = {
    email: emailAtt,
    nome: nomeAtt,
    senha: senhaAtt
  }
  const colaborador = {
    email: email,
    senha: senha,
    nome: nome
  }

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

  function mostrarMembros(equipe) {
    setMembrosEquipe(equipe.membros);
    setmodalMembros(true);
  }

  async function abrirPastasRaiz() {
    const dados = await receberPastasRaiz();
    setListaPastasRaiz(dados);
    setTipomodalarquivos("raiz");
    setmodalArquivo(true);
  }

  async function criarNovaEquipe() {
    const equipeData = {
      nomeEmpresa: nomeNovaEquipe
    };
    await criarEquipe(equipeData);
    setmodalNovaEquipe(false);
  }

  const arquivosPastaOrdenados = [...arquivosPasta].sort((a, b) => {
    if (tipoOrdenacao === "data") {
      const dataA = new Date(a.dataUpload);
      const dataB = new Date(b.dataUpload);
      return ordemDesc ? dataB - dataA : dataA - dataB;
    } else {
      return ordemDesc
        ? b.nome.localeCompare(a.nome)
        : a.nome.localeCompare(b.nome);
    }
  });

  const membrosFiltrados = membrosEquipe.filter((membro) =>
    !busca || membro.nome.toLowerCase().includes(busca.toLowerCase())
  );

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

  function ordenarArquivos() {
    setOrdemDesc(!ordemDesc);
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

  async function cadastroUsuario() {

    try {
      const resposta = await fetch(`${URL_BASE}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(colaborador)
      });

      const dados = await resposta.json();

      toast.success("Sucesso no cadastro do usuário");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setNome("");

    } catch (erro) {
      toast.error("Erro no cadastro do usuário");
    }
  }

  return (
    <>
      <div className="w-64 h-screen bg-[var(--bgbutton)] text-white flex flex-col">
        <h1 className="p-4 text-[var(--branco)] text-2xl font-bold">
          Relic
        </h1>
        <div className="mt-4 flex items-center px-4 py-2">
        <i className="bi bi-folder"></i>
        <h1 className="text-xl text-[var(--branco)] font-bold px-1">Documentos</h1>
        </div>
        <nav className="flex flex-col mt-4">
          {listaArquivos.map((arquivo) => (
            <a key={arquivo.id} className="cursor-pointer text-[var(--branco)] px-4 py-2 hover:bg-gray-700">
              {arquivo.nome}
            </a>
          ))}
          <div className="px-4 py-2 hover:bg-[var(--bgbuttonhover)] cursor-pointer flex items-center" onClick={abrirPastasRaiz}>
          <i className="bi bi-plus"></i>
          <a className=" text-[var(--branco)] px-1 ">Mais arquivos...</a>
        </div>
        </nav>
        <div className="mt-auto text-sm py-2 text-gray-400">
          {isAdmin && (

            <button
              onClick={() => setmodalEquipe(true)}
              className="w-full self-start text-[var(--branco)] font-bold py-2 hover:bg-[var(--bgbuttonhover)] hover:cursor-pointer">
             <div className="flex justify-center p-2">
             <i className="bi bi-people"></i> 
             <p className="px-1">Equipes</p>
             </div>
              </button>

          )}
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
      <Modal //modal de arquivos
        isOpen={modalArquivo}
        onClose={() => setmodalArquivo(false)}
        title="Meu Modal"
        className="text-black m-90 max-h-2/3 overflow-y-auto"
        width="w-full h-full">
        <div className="p-4">
          {tipomodalarquivos === "raiz" && ( //modal de pastas raiz
            <>
              <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>
              <div className="my-4">
                <button onClick={() => {
                  setTipoOrdenacao("nome");
                  setOrdemDesc(!ordemDesc);
                }} className="my-4 mr-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-sort-alpha-down-alt"></i> Ordenar por nome</p></button>
              </div>
              <div className="w-full mx-auto overflow-y-auto max-h-96">
                {listaPastasRaiz.map((arquivo) => (
                  <div className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-gray-200"
                    key={arquivo.id}>
                    <div className="flex-2 flex justify-between items-center"
                      onClick={() => mostrarArquivosPasta(arquivo)}>
                      <p><i className="bi bi-folder"></i>
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
                  <div className="w-full cursor-pointer flex justify-between items-center p-2 rounded hover:bg-gray-200"

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

      <Modal //modal de equipes
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
              <div className="flex flex-col">
                {listaEquipes.map((equipe) => (
                  <div key={equipe.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-200">
                    <p
                      className="cursor-pointer flex-2 hover:bg-gray-300 p-1 rounded"
                      onClick={() => mostrarMembros(equipe)}
                    >
                      <i className="bi bi-people"></i>
                      {equipe.nome}
                    </p>
                    <ActionMenu className="flex-1"
                      options={[
                        {
                          label: "Editar",
                          onClick: () => {

                          }
                        },
                        {
                          label: "Excluir",
                          onClick: () => {

                          }
                        }
                      ]}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {modalMembros && ( //modal de membros da equipe
            <>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setmodalMembros(false)}>
                  ← Voltar
                </button>
                <input
                  type="text"
                  placeholder="Buscar membro..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 ">Membros</h2>
              <button onClick={() => setmodalNovoMembro(true)} className="my-4 text-l cursor-pointer"><p className="text-xl"><i className="bi bi-person"></i> Novo membro</p></button>

              <div className="flex flex-col">
                {membrosFiltrados.map((membro, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-200">
                    <p className="cursor-pointer flex-2 hover:bg-gray-300 p-1 rounded">

                      <i className="bi bi-person"></i> {membro.nome}


                    </p>
                    <ActionMenu className="flex-1"
                      options={[{
                        label: "mover para...",
                        onClick: () => {
                          setmodalMoverMembro(true);
                        }
                      },
                      {
                        label: "Editar",
                        onClick: () => {
                          setMembro(membro);
                          setmodalEditarMembro(true);
                          setEmailAtt(membro.email);
                          setNomeAtt(membro.nome);
                          setSenhaAtt(membro.senha);
                        }
                      },
                      {
                        label: "Excluir",
                        onClick: () => {

                        }
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
      <Modal //modal para criar nova equipe
        isOpen={modalNovaEquipe}
        onClose={() => setmodalNovaEquipe(false)}>
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova equipe" className="border p-2 w-full mb-4"
            value={nomeNovaEquipe}
            onChange={(e) => setNomeNovaEquipe(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => criarNovaEquipe()}
          >Criar equipe</button>
        </div>
      </Modal>

      <Modal //modal para adicionar novo membro a equipe
        isOpen={modalNovoMembro}
        onClose={() => setmodalNovoMembro(false)}>
        <div className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            className="border text-black bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          {senha !== confirmarSenha && confirmarSenha !== "" ? (
            <p className="text-red-500 text-sm">As senhas não coincidem</p>
          ) : null}
          <button onClick={() => cadastroUsuario()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={senha !== confirmarSenha || email === "" || nome === "" || senha === "" || confirmarSenha === ""}
          >Cadastrar</button>
        </div>
      </Modal>
      <Modal //modal para mover membro para outra equipe
        isOpen={modalMoverMembro}
        onClose={() => setmodalMoverMembro(false)} className="text-black">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Mover para equipe:</h2>
          {listaEquipes.map((equipe) => (
            <label className="mb-2 cursor-pointer" key={equipe.id}>
              <input type="checkbox" name="equipe" value={equipe.id} className="mr-2" />
              {equipe.nome}
            </label>
          ))}
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
        </div>
      </Modal>
      <Modal //modal para editar informações do membro
        isOpen={modalEditarMembro}
        onClose={() => setmodalEditarMembro(false)} className="text-black">
        <div className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={emailAtt}
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmailAtt(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            value={nomeAtt}
            className="border text-black bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNomeAtt(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senhaAtt}
            className="border bg-white text-black border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSenhaAtt(e.target.value)}
            required
          />

          <button onClick={() => cadastroUsuario()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={emailAtt === "" || nomeAtt === "" || senhaAtt === ""}
          >Atualizar</button>
        </div>
      </Modal>
    </>

  );
}
