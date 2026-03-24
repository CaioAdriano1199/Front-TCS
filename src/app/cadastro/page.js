"use client";
import Card from "../componentes/card/card";
import {useState } from "react";

export default function Cadastro() {
  const [pgc, setPgc] = useState(0);
  const [compsenha,setcompsenha] = useState(false);
  const [email, setEmail] = useState("");
  const [none, setNone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeempresa, setNomeempresa] = useState("");

  const infocadastro = {
    email: email,
    none: none,
    password: password,
    confirmPassword: confirmPassword,
    cnpj: cnpj,
    nomeEmpresa: nomeempresa
  }

  async function cadastro() {

  try {
    const resposta = await fetch("http://localhost:8080/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(infocadastro)
    });

    const dados = await resposta.json();

    console.log("Sucesso:", dados);
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

  function compararsenha(e) {
    const value = e.target.value;
    setConfirmPassword(value);
  
    setcompsenha(password !== value);
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
                  type="submit"
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
                  onChange={(e) => setNone(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password" 
                  placeholder="Confirmar senha"
                  className="border bg-white text-black border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => compararsenha(e)}
                  required
                />
                {password !== confirmPassword && compsenha === true ? (
                  <p className="text-red-500 text-sm">As senhas não coincidem</p>
                ) : null}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={password !== confirmPassword || compsenha === true || password === "" || confirmPassword === ""|| none === ""}
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
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={cadastro}
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
            
            