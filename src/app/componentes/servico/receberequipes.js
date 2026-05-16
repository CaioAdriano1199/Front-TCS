import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberEquipes() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const resposta = await fetch(`${BASE_URL}/equipes/access`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "bypass-tunnel-reminder": "true",
        Authorization: `Bearer ${token}`
      }
    });


    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro:", erro);
    toast.error("Erro ao receber a lista de equipes. Tente novamente.");
    return [];
  }
}
