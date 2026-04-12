"use client";
import { useState } from "react";
import Card from "../componentes/card/card"
import { redirect } from "next/navigation";
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

    <main className="flex min-h-screen flex-col items-center justify-center bg-white">

      <Card className="flex w-100 flex-col justify-center mt-6 bg-gray-500">
        <h1 className="self-center p-5 text-3xl font-semibold text-black">
          Relic
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSenha(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-200 hover:bg-gray-170 my-2.5 text-black font-bold py-2 px-4 rounded-md"
          onClick={login}
        >
          Login
        </button>
      </Card>
    </main>
  )
}