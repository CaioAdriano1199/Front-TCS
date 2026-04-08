"use client";
import { receberarquivos } from "../servico/receberarquivos";
import { receberEquipes } from "../servico/receberequipes";
import { useState, useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import Modal from "../modal/modal";
import toast from "react-hot-toast";
import ActionMenu from "../menudeacao/menudeacao";

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
    if (tipoOrdenacao === "data") {
      const dataA = new Date(a.dataUpload);
      const dataB = new Date(b.dataUpload);

      return ordemDesc
        ? dataB - dataA
        : dataA - dataB;
    }
    else if (tipoOrdenacao === "nome") {
      const nomeA = a.nome.toLowerCase();
      const nomeB = b.nome.toLowerCase();

      return ordemDesc
        ? nomeB.localeCompare(nomeA)
        : nomeA.localeCompare(nomeB);
    }
  });

  function ordenarArquivos() {
    setOrdemDesc(!ordemDesc);
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
      const resposta = await fetch("http://localhost:8081/usuarios", {
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
              toast.error("Modo admin desativado");
            } else {
              setIsAdmin(true);
              toast.success("Modo admin ativado");
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
          {!modalArquivoPasta && ( //modal de arquivos principais
            <>
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
          {modalArquivoPasta && ( //modal de arquivos dentro da pasta
            <>
              <button onClick={() => setmodalArquivoPasta(false)}>
                ← Voltar
              </button>
              <h2 className="text-2xl font-bold mb-2">Arquivos na Pasta</h2>
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
              <div className="w-full mx-auto overflow-y-auto max-h-96">
                {arquivosPastaOrdenados.map((arquivo) => (
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
      <Modal
        isOpen={modalNovaEquipe} //modal para criar nova equipe
        onClose={() => setmodalNovaEquipe(false)}>
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova equipe" className="border p-2 w-full mb-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar equipe</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalNovapasta} //modal para criar nova pasta
        onClose={() => setmodalNovaPasta(false)}
        className="text-black">
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da nova pasta" className="border p-2 w-full mb-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar pasta</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalNovoMembro} //modal para adicionar novo membro a equipe
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
      <Modal
        isOpen={modalMoverMembro} //modal para mover membro para outra equipe
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
      <Modal
        isOpen={modalEditarMembro} //modal para editar informações do membro
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
