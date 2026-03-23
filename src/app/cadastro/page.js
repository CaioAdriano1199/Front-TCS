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
  const [companyName, setCompanyName] = useState("");

  const infocadastro = {
    email: email,
    none: none,
    password: password,
    confirmPassword: confirmPassword,
    cnpj: cnpj,
    companyName: companyName
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
                  className="border bg-white border-gray-300 rounded-md my-5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => setPgc(1)}
                >
                  Continuar
                </button>
              </form>
              )} {pgc === 1 && (
               
                <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="border bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setNone(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="border bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password" 
                  placeholder="Confirmar senha"
                  className="border bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => compararsenha(e)}
                />
                {password !== confirmPassword && compsenha === true ? (
                  <p className="text-red-500 text-sm">As senhas não coincidem</p>
                ) : null}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
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
                  className="border bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setCnpj(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nome da empresa"
                  className="border bg-white border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setCompanyName(e.target.value)}
                />     
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cadastrar
                </button>
              </form>
              )}
            </Card>
            </main>
    )
              }
            
            