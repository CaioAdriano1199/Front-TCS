"use client";
import toast from "react-hot-toast";
import Card from "../componentes/card/card";
import {useState } from "react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [pgc, setPgc] = useState(0);
  const [compsenha,setcompsenha] = useState(false);
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

const cadastro ={
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

            <Card className="flex w-100 flex-col justify-center mt-6 bg-gray-500">
              <div className=" self-center flex justifi-center flex-col p-5">
                <h2 className="self-center text-3xl font-semibold leading-10 tracking-tight text-black"> 
                    Relic
                </h2>
                <h1 className="text-4xl self-center">
                Cadastro
                </h1>
                </div>
              {pgc === 0 && (
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="border bg-white text-black border-gray-300 rounded-md my-5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                  className="border text-black bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <input
                  type="password" 
                  placeholder="Confirmar senha"
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => compararsenha(e)}
                  required
                />
                {senha !== confirmSenha && compsenha === true ? (
                  <p className="text-red-500 text-sm">As senhas não coincidem</p>
                ) : null}
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={senha !== confirmSenha || compsenha === true || senha === "" || confirmSenha === ""|| nome === ""}
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
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Nome da empresa"
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNomeempresa(e.target.value)}
                  required
                />     
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => cadastroEmpresa()}
                  disabled={cnpj === "" || nomeempresa === ""}
                >
                  Cadastrar
                </button>
              </form>
              )}
            </Card>
            </main>
    )
              }
            
            