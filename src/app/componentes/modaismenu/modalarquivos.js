"use client";
import Modal from "../modal/modal";
import ActionMenu from "../menudeacao/menudeacao";

export default function ModalArquivos({
  isOpen,
  onClose,
  tipomodalarquivos,
  listaPastasRaiz,
  arquivosOrdenados,
  mostrarArquivosPasta,
  voltarPasta,
  setTipoOrdenacao,
  ordemDesc,
  setOrdemDesc,
  setmodalNovaPasta,
  abrirSeletor,
  inputRef,
  handleUpload
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="text-black m-90 max-h-2/3 overflow-y-auto"
      width="w-full h-full"
    >
      <div className="p-4">

        {tipomodalarquivos === "raiz" && (
          <>
            <h2 className="text-2xl font-bold mb-2">Lista de Arquivos</h2>

            <button onClick={() => {
              setTipoOrdenacao("nome");
              setOrdemDesc(!ordemDesc);
            }}>
              Ordenar por nome
            </button>

            {listaPastasRaiz.map((arquivo) => (
              <div key={arquivo.id}
                onClick={() => mostrarArquivosPasta(arquivo)}>
                {arquivo.nome}
              </div>
            ))}
          </>
        )}

        {tipomodalarquivos === "pastaprincipal" && (
          <>
            <button onClick={voltarPasta}>← Voltar</button>

            <button onClick={() => setmodalNovaPasta(true)}>
              Nova pasta
            </button>

            <button onClick={abrirSeletor}>
              Novo arquivo
            </button>

            <input
              type="file"
              ref={inputRef}
              onChange={handleUpload}
              className="hidden"
            />

            {arquivosOrdenados.map((arquivo) => (
              <div key={arquivo.id}>
                {arquivo.nome}

                <ActionMenu
                  options={[
                    { label: "Editar", onClick: () => {} },
                    { label: "Excluir", onClick: () => {} }
                  ]}
                />
              </div>
            ))}
          </>
        )}

      </div>
    </Modal>
  );
}