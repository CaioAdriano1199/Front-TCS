import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberEquipes() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const resposta = await fetch(`${BASE_URL}/equipes/access`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      const erroBody = await resposta.json().catch(() => null);
      const mensagem = erroBody?.message || `Erro ${resposta.status}`;
      toast.error("Erro ao receber a lista de equipes. Tente novamente.");
      throw new Error(mensagem);
    }

    const dados = await resposta.json();
    toast.success("Lista de equipes recebida com sucesso!");
    return dados;
  } catch (erro) {
    console.error("Erro:", erro);
    toast.error("Erro ao receber a lista de equipes. Tente novamente.");
    return [];
  }
}
