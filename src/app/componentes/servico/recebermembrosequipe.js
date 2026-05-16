const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberMembrosEquipe(equipeId) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const resposta = await fetch(`${BASE_URL}/equipes/${equipeId}/funcionarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`
      }
    });
    const dados = await resposta.json();
    return dados;
  } catch (error) {
    console.error("Erro ao receber membros da equipe:", error);
    throw error;
  }
}