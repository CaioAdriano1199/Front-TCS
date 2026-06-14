"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import toast from "react-hot-toast";
import ActionMenu from "../menudeacao/menudeacao";
import { receberEquipes } from "../servico/receberequipes";
import { criarEquipe } from "../servico/criarequipe";
import { receberMembrosEquipe } from "../servico/recebermembrosequipe";
import { criarFuncionario } from "../servico/criarfuncionario";
import { excluirFuncionario } from "../servico/excluirfuncionario";
import { receberUsuarioPorId } from "../servico/reberusuarioporid";
import { moverusuario } from "../servico/moverusuario";
import { excluirEmpresa } from "../servico/excluirempresa";

export default function EquipeModals({ URL_BASE, isAdmin, listaEquipes, setListaEquipes, isOpen, onClose, onOpen }) {
  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [modalEquipe, setmodalEquipe] = useState(false);
  const [modalNovaEquipe, setmodalNovaEquipe] = useState(false);
  const [modalNovoMembro, setmodalNovoMembro] = useState(false);
  const [modalMembros, setmodalMembros] = useState(false);
  const [modalMoverMembro, setmodalMoverMembro] = useState(false);
  const [modalEditarMembro, setmodalEditarMembro] = useState(false);
  const [nomeNovaEquipe, setNomeNovaEquipe] = useState("");
  const [caminhoBase, setCaminhoBase] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [emailAtt, setEmailAtt] = useState("");
  const [senhaAtt, setSenhaAtt] = useState("");
  const [nomeAtt, setNomeAtt] = useState("");
  const [busca, setBusca] = useState("");
  const [membro, setMembro] = useState({});
  const [equipeAtual, setEquipeAtual] = useState(null);
  const [equipesSelecionadas, setEquipesSelecionadas] = useState([]);
  const [usuariorecebido, setUsuarioRecebido] = useState({});
  const [modalexcluirEquipe, setModalExcluirEquipe] = useState(false);
  const [modalExcluirMembro, setModalExcluirMembro] = useState(false);

  const [equipeparaexcluir, setEquipeParaExcluir] = useState("");
  const [admSistema, setAdmSistema] = useState(false);
  const [admSistemaAtt, setAdmSistemaAtt] = useState(false);

  const colaboradorAtt = {
    email: emailAtt,
    nome: nomeAtt,
    senha: senhaAtt,
    admSistema: admSistemaAtt,
  };

  async function carregarMembrosEquipe(equipeId) {
    const membros = await receberMembrosEquipe(equipeId);
    setMembrosEquipe(membros.funcionarios || []);
  }

  function mostrarMembros(equipeId) {
    carregarMembrosEquipe(equipeId);
    setEquipeAtual(equipeId);
    setmodalMembros(true);
  }

  async function movarUsariofun() {
    try {
      await moverusuario(usuariorecebido.id, equipesSelecionadas);
      toast.success("Usuário movido com sucesso");
      setmodalMoverMembro(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao mover usuário");
    }
  }

  async function carregarusuario(funcionarioId) {
    try {
      const usuario = await receberUsuarioPorId(funcionarioId);
      setUsuarioRecebido(usuario);
      setEquipesSelecionadas(usuario.idsEquipes || []);
      setmodalMoverMembro(true);
    } catch (error) {
      toast.error("Erro ao carregar usuário");
    }
  }

  async function excluirMembro(funcionarioId) {
    try {
      await excluirFuncionario(funcionarioId);
      toast.success("Funcionário excluído com sucesso");
      carregarMembrosEquipe(equipeAtual);
    } catch (error) {
      toast.error("Erro ao excluir funcionário");
    }
  }

  async function criarNovaEquipe() {
    if (!nomeNovaEquipe.trim()) {
      toast.error("Por favor, informe o nome da empresa");
      return;
    }
    if (!caminhoBase.trim()) {
      toast.error("Por favor, informe o caminho da pasta raiz");
      return;
    }
    const equipeData = { nomeEmpresa: nomeNovaEquipe, caminhoBase: caminhoBase };
    await criarEquipe(equipeData);
    setmodalNovaEquipe(false);
    setNomeNovaEquipe("");
    setCaminhoBase("");
    const dados = await receberEquipes();
    setListaEquipes(dados);
  }

  async function cadastroUsuario() {
    try {
      const novoColaborador = {
        email: email,
        nome: nome,
        senha: senha,
        idEquipe: equipeAtual,
        idsEquipes: [equipeAtual],
        admSistema: admSistema,
      };
      await criarFuncionario(novoColaborador);
      toast.success("Sucesso no cadastro do usuário");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setNome("");
      setmodalNovoMembro(false);
      setAdmSistema(false);
      carregarMembrosEquipe(equipeAtual);
    } catch (erro) {
      toast.error("Erro no cadastro do usuário");
    }
  }

  async function atualizarUsuario() {
    try {
      const funcionarioId = membro.id;
      const funcionarioData = {
        email: emailAtt,
        nome: nomeAtt,
        senha: senhaAtt,
        admSistema: admSistemaAtt,
      };
      const { atualizarFuncionario } = await import("../servico/atualizarfuncionario");
      await atualizarFuncionario(funcionarioId, funcionarioData);
      toast.success("Usuário atualizado com sucesso");
      setmodalEditarMembro(false);
      carregarMembrosEquipe(equipeAtual);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar usuário");
    }
  }

  async function confirmarExcluirEquipe() {
    if (!equipeparaexcluir) {
      toast.error("Nenhuma equipe selecionada para exclusão.");
      return;
    }

    try {
      await excluirEmpresa(equipeparaexcluir);
      toast.success("Equipe excluída com sucesso");
      setModalExcluirEquipe(false);
      setEquipeParaExcluir("");
      const dados = await receberEquipes();
      setListaEquipes(dados);
    } catch (error) {
      console.error("Erro ao excluir equipe no modal:", error);
      toast.error(error.message || "Não foi possível excluir a equipe.");
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
        title={modalMembros ? "Membros" : "Lista de Equipes"}
        className="text-black m-90 max-h-2/3 overflow-y-auto"
        width="w-full">
        <div className="p-4">
          {!modalMembros && (
            <>
              <div className="my-4">
                <button onClick={() => setmodalNovaEquipe(true)} className="my-4 mr-4 cursor-pointer"><p className="text-m font-semibold"><i className="bi bi-people"></i> Nova equipe</p></button>
              </div>
              <div className="flex flex-col">
                {listaEquipes.map((equipe) => (
                  <div key={equipe.id} className="flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]">
                    <p
                      className="cursor-pointer flex-2 hover:bg-[var(--cinzaclaro)] p-1 rounded"
                      onClick={() => mostrarMembros(equipe.id)}
                    >
                      <i className="bi bi-people px-1"></i>
                      {equipe.nomeEmpresa || equipe.nome}
                    </p>
                    <ActionMenu className="flex-1"
                      options={[
                        {
                          label: "Excluir",
                          onClick: () => {setEquipeParaExcluir(equipe.id); setModalExcluirEquipe(true);},
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          {modalMembros && (
            <>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setmodalMembros(false)}>
                  <i className="bi bi-arrow-left text-lg hover:cursor-pointer hover:text-[var(--phgray)]"></i>
                </button>
                <input
                  className="bg-[var(--cinzaclaro)] rounded p-2 focus:outline-none"
                  type="text"
                  placeholder="Buscar membro..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <button onClick={() => setmodalNovoMembro(true)} className="my-4 cursor-pointer"><p className="text-m font-semibold"><i className="bi bi-person"></i> Novo membro</p></button>

              <div className="flex flex-col">
                {membrosFiltrados.map((membroItem, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-[var(--cinzaclaro)]">
                    <p className="cursor-pointer flex-2 hover:bg-[var(--cinzaclaro)] p-1 rounded">
                      <i className="bi bi-person px-1"></i> {membroItem.nome}
                    </p>
                    <ActionMenu className="flex-1 bg-[var(--bginput)] rounded"
                      options={[
                        {
                          label: "mover para...",
                          onClick: () => carregarusuario(membroItem.id),
                          className: "bg-[var(--bginput)] hover:bg-[var(--cinzaclaro)] hover:cursor-pointer text-[var(--preto)]",
                        },
                        {
                          label: "Editar",
                          onClick: () => {
                            setMembro(membroItem);
                            setmodalEditarMembro(true);
                            setEmailAtt(membroItem.email);
                            setNomeAtt(membroItem.nome);
                            setSenhaAtt(membroItem.senha);
                            setAdmSistemaAtt(membroItem.admSistema || false);
                          },
                          className: "bg-[var(--bginput)] hover:bg-[var(--cinzaclaro)] hover:cursor-pointer text-[var(--preto)]",
                        },
                        {
                          label: "Excluir",
                          onClick: () => setModalExcluirMembro(true) || setMembro(membroItem),
                          className: "bg-[var(--bginput)] hover:bg-[var(--cinzaclaro)] hover:cursor-pointer text-[var(--preto)]",
                        },
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
        onClose={() => setmodalNovaEquipe(false)}
        title="Nova Equipe">
        <div className="flex flex-col items-center">
          <input type="text" placeholder="Nome da empresa" className="border-none bg-[var(--cinzaclaro)] focus:outline-none rounded p-2 w-full mb-4"
            value={nomeNovaEquipe}
            onChange={(e) => setNomeNovaEquipe(e.target.value)}
          />
          <input type="text" placeholder="Caminho da pasta raiz" className="border-none bg-[var(--cinzaclaro)] focus:outline-none rounded p-2 w-full mb-4"
            value={caminhoBase}
            onChange={(e) => setCaminhoBase(e.target.value)}
          />
          <button className=" max-w-sm w-full my-2" onClick={() => criarNovaEquipe()} disabled={!nomeNovaEquipe.trim() || !caminhoBase.trim()}>Criar equipe</button>
        </div>
      </Modal>

      <Modal //modal para adicionar novo membro a equipe
        isOpen={modalNovoMembro}
        onClose={() => setmodalNovoMembro(false)}
        title="Novo Membro"
        className="w-md">
        <div className="flex flex-col w-full items-center px-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <input type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <label className="flex items-center gap-2 mt-2 mb-4">
            <input type="checkbox" checked={admSistema} onChange={(e) => setAdmSistema(e.target.checked)} className="accent-[var(--bgbutton)]" />
            <span>Administrador</span>
          </label>
          {senha !== confirmarSenha && confirmarSenha !== "" ? (<p className="text-red-500 text-sm">As senhas não coincidem</p>) : null}
          <button onClick={() => cadastroUsuario()} className=" max-w-sm w-full my-2" disabled={senha !== confirmarSenha || email === "" || nome === "" || senha === "" || confirmarSenha === ""}>Cadastrar</button>
        </div>
      </Modal>

      <Modal //modal para mover membro para outra equipe
        isOpen={modalMoverMembro}
        onClose={() => setmodalMoverMembro(false)}
        title="Mover para equipe"
        className="text-black w-sm">
        <div className="flex flex-col items-start px-6">
          {listaEquipes.map((equipe) => (
            <label className="mb-2 cursor-pointer text-base" key={equipe.id}>
              <input type="checkbox" value={equipe.id} className="mr-2 accent-[var(--bgbutton)]" checked={equipesSelecionadas.includes(equipe.id)} onChange={(e) => {
                if (e.target.checked) setEquipesSelecionadas([...equipesSelecionadas, equipe.id]);
                else setEquipesSelecionadas(equipesSelecionadas.filter(id => id !== equipe.id));
              }} />
              {equipe.nomeEmpresa || equipe.nome}
            </label>
          ))}
          <button disabled={equipesSelecionadas.length === 0} className=" max-w-sm w-full" onClick={() => movarUsariofun()}>Salvar</button>
        </div>
      </Modal>

      <Modal //modal para editar informações do membro
        isOpen={modalEditarMembro}
        onClose={() => setmodalEditarMembro(false)}
        title="Editar Membro"
        className="w-md">
        <div className="flex flex-col w-full items-center px-6">
          <input type="email" placeholder="Email" value={emailAtt} onChange={(e) => setEmailAtt(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <input type="text" placeholder="Nome" value={nomeAtt} onChange={(e) => setNomeAtt(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <input type="password" placeholder="Senha" value={senhaAtt} onChange={(e) => setSenhaAtt(e.target.value)} required className="border border-[var(--bgbutton)]/20 bg-[var(--branco)] text-[var(--preto)] rounded w-full my-2 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)]" />
          <label className="flex items-center gap-2 mt-2 mb-4">
            <input type="checkbox" checked={admSistemaAtt} onChange={(e) => setAdmSistemaAtt(e.target.checked)} className="accent-[var(--bgbutton)]" />
            <span>Administrador</span>
          </label>
          <button onClick={() => atualizarUsuario()} className=" max-w-sm w-full my-2" disabled={emailAtt === "" || nomeAtt === "" || senhaAtt === ""}>Atualizar</button>
        </div>
      </Modal>

      <Modal //modal para confirmar exclusão de equipe
        isOpen={modalexcluirEquipe}
        onClose={() => setModalExcluirEquipe(false)}
        title="Confirmar exclusão"
        className="w-sm">
        <div className="flex flex-col items-center px-6">
          <p className="mb-4">Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-4">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => {setModalExcluirEquipe(false)}}>Cancelar</button>
            <button className="close-modal-button hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => {confirmarExcluirEquipe()}}>Excluir</button>
          </div>
        </div>
      </Modal>

      <Modal //modal para confirmar exclusão de membro
        isOpen={modalExcluirMembro}
        onClose={() => setModalExcluirMembro(false)}
        title="Confirmar exclusão"
        className="w-sm">
        <div className="flex flex-col items-center px-6">
          <p className="mb-4">Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-4">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => {setModalExcluirMembro(false)}}>Cancelar</button>
            <button className="close-modal-button hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => {excluirMembro(membro.id)}}>Excluir</button>
          </div>
        </div>
      </Modal>

    </>
  );
}
