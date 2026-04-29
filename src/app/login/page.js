"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const infologin = {
    email: email,
    senha: senha
  }

  async function login() {
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(infologin)

      });

      const dados = await resposta.json();
      const token = dados.token;
      const admin = dados.admSistema;
      console.log("Token recebido:", token);
      console.log("Admin:", admin);
      localStorage.setItem("token", token);
      localStorage.setItem("admin", admin);
      toast.success("Login bem-sucedido!");
      router.push("/main");

    } catch (erro) {
      console.error("Erro no login:", erro);
      toast.error("Erro no login");
      console.log("BASE_URL:", BASE_URL);
    }
  }

  return (

    <main className="bg-[url('/fundoAlt.png')] bg-cover bg-center bg-no-repeat min-h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--azultransp)] backdrop-blur-sm w-full h-full absolute top-0 left-0">
      <div className="gradient-vertical left-0"></div>
      <div className="gradient-vertical right-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto p-4">
      <div className="flex w-100 flex-col justify-center p-10 mt-6 bg-[var(--bginput)] rounded-lg shadow-md">
        <h1 className="self-center p-5 text-3xl font-semibold text-black">
          Relic
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border bg-[var(--cinzaclaro)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)] focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border bg-[var(--cinzaclaro)] border-gray-300 rounded-md my-2.5 py-2 px-4 text-[var(--preto)]  focus:outline-none focus:ring-2 focus:ring-[var(--bgbutton)] placeholder:text-[var(--phgray)]"
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[var(--bgbutton)] hover:bg-[var(--bgbuttonhover)] my-2.5 text-[var(--branco)] font-bold py-2 px-4 rounded-md hover:cursor-pointer transition-colors duration-300"
          onClick={login}
        >
          Login
        </button>
        <p className="self-center p-5 text-sm text-[var(--cinzaescuro)] font-semibold">
          Não tem uma conta? <a href="/cadastro" className="text-[var(--bgbutton)] hover:underline">Cadastre-se</a>
        </p>
      </div>
      </div>
      </div>
    </main>
  )
}