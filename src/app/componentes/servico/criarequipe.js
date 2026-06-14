import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getCurrentUserId() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, "+").replace(/_/g, "/")).split("").map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join("")));
    return decoded.id || decoded.userId || decoded.sub || decoded.idUser || null;
  } catch (error) {
    return null;
  }
}

export async function criarEquipe(equipeData) {
  try {
    const idUser = getCurrentUserId() || 10;
    const resposta = await fetch(`${BASE_URL}/equipes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        nomeEmpresa: equipeData.nomeEmpresa,
        caminhoBase: equipeData.caminhoBase
      })
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      throw new Error(errorData.message || "Erro ao criar a equipe");
    }

    toast.success("Equipe criada com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    toast.error("Erro ao criar a equipe. Tente novamente.");
  }
}