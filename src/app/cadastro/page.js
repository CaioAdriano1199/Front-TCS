"use client";
import toast from "react-hot-toast";
import Card from "../componentes/card/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [pgc, setPgc] = useState(0);
  const [compsenha, setcompsenha] = useState(false);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeempresa, setNomeempresa] = useState("");
  const BASe_URL = process.env.NEXT_PUBLIC_API_URL;

  const usuario = {
    email: email,
    nome: nome,
    senha: senha
  }

  const empresa = {
    cnpj: cnpj,
    nome: nomeempresa
  }

  const cadastro = {
    usuario: usuario,
    empresa: empresa
  }






  async function cadastroEmpresa() {

    try {
      const resposta = await fetch(`${BASe_URL}/empresas/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cadastro)
      });

      const dados = await resposta.json();

      toast.success("Sucesso no cadastro da empresa");
      router.push("/login");
    } catch (erro) {
      console.error("Erro:", erro);
      toast.error("Erro no cadastro da empresa");
    }
  }

  function compararsenha(e) {
    const value = e.target.value;
    setConfirmSenha(value);

    setcompsenha(senha !== value);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="gradient-vertical left-0"></div>
      <div className="gradient-vertical right-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto p-4">
        <div className="flex w-100 flex-col justify-center p-10 mt-6 bg-transparent">
          <div className=" self-center flex justifi-center flex-col p-5">
            <h2 className="self-center text-3xl font-semibold leading-10 tracking-tight text-[var(--preto)]">
              Relic
            </h2>
            <h1 className="text-4xl text-[var(--preto)] self-center">
              Cadastro
            </h1>
          </div>
          {pgc === 0 && (
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer transition-colors duration-300 disabled:bg-[var(--phgray)] disabled:cursor-not-allowed" 
                onClick={() => setPgc(1)}
                disabled={email === ""}
              >
                Continuar
              </button>
            </form>
          )} {pgc === 1 && (

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => compararsenha(e)}
                required
              />
              {senha !== confirmSenha && compsenha === true ? (
                <p className="text-red-500 text-sm">As senhas não coincidem</p>
              ) : null}
              <button
                type="button"
                className="bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer transition-colors duration-300 disabled:bg-[var(--phgray)] disabled:cursor-not-allowed"
                disabled={senha !== confirmSenha || compsenha === true || senha === "" || confirmSenha === "" || nome === ""}
                onClick={() => setPgc(2)}
              >
                Continuar
              </button>
            </form>
          )}  {pgc === 2 && (
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="CNPJ"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => setCnpj(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Nome da empresa"
                className="border bg-[var(--bginput)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
                onChange={(e) => setNomeempresa(e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] text-white font-bold py-2 px-4 rounded-md hover:cursor-pointer transition-colors duration-300 disabled:bg-[var(--phgray)] disabled:cursor-not-allowed"
                onClick={() => cadastroEmpresa()}
                disabled={cnpj === "" || nomeempresa === ""}
              >
                Cadastrar
              </button>
            </form>
          )}
          <p className="self-center p-5 text-sm text-[var(--cinzaescuro)] font-semibold">
            Já tem uma conta? <a href="/login" className="text-[var(--bgbutton)] hover:underline">Faça login</a>
          </p>
        </div>
      </div>
    </main>
  )
}

