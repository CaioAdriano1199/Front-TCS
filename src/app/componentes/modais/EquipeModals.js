"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import toast from "react-hot-toast";
import ActionMenu from "../menudeacao/menudeacao";
import { receberEquipes } from "../servico/receberequipes";
import { criarEquipe } from "../servico/criarequipe";

export default function EquipeModals({ URL_BASE, isAdmin, listaEquipes, setListaEquipes, isOpen, onClose, onOpen }) {
  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [modalEquipe, setmodalEquipe] = useState(false);
  const [modalNovaEquipe, setmodalNovaEquipe] = useState(false);
  const [modalNovoMembro, setmodalNovoMembro] = useState(false);
  const [modalMembros, setmodalMembros] = useState(false);
  const [modalMoverMembro, setmodalMoverMembro] = useState(false);
  const [modalEditarMembro, setmodalEditarMembro] = useState(false);
  const [nomeNovaEquipe, setNomeNovaEquipe] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [emailAtt, setEmailAtt] = useState("");
  const [senhaAtt, setSenhaAtt] = useState("");
  const [nomeAtt, setNomeAtt] = useState("");
  const [busca, setBusca] = useState("");
  const [membro, setMembro] = useState({});

  const colaborador = {
    email: email,
    senha: senha,
    nome: nome
  };

  const colaboradorAtt = {
    email: emailAtt,
    nome: nomeAtt,
    senha: senhaAtt
  };

  function mostrarMembros(equipe) {
    setMembrosEquipe(equipe.membros);
    setmodalMembros(true);
  }

  async function criarNovaEquipe() {
    const equipeData = {
      nomeEmpresa: nomeNovaEquipe
    };
    await criarEquipe(equipeData);
    setmodalNovaEquipe(false);
    // Recarregar equipes
    const dados = await receberEquipes();
    setListaEquipes(dados);
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

  const membrosFiltrados = membrosEquipe.filter((membro) =>
    !busca || membro.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      {isAdmin && (
        <button
          onClick={() => onOpen()}
          className="w-full self-start text-[var(--branco)] font-bold py-2 hover:bg-[var(--bgbuttonhover)] hover:cursor-pointer">
          <div className="flex justify-center p-2">
            <i className="bi bi-people"></i>
            <p className="px-1">Equipes</p>
          </div>
        </button>
      )}

      <Modal //modal de equipes
        isOpen={isOpen}
        onClose={onClose}
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