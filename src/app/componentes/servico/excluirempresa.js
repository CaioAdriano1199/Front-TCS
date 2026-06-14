import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function excluirEmpresa(id) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const resposta = await fetch(`${BASE_URL}/equipes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`
      }
    });

    if (!resposta.ok) {
      let errorMessage = "Erro ao excluir empresa";
      try {
        const errorData = await resposta.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // resposta sem corpo
      }
      throw new Error(errorMessage);
    }

    if (resposta.status !== 204) {
      throw new Error("Resposta inesperada do servidor ao excluir empresa.");
    }
  } catch (error) {
    console.error("Erro ao excluir empresa:", error);
    toast.error("Não foi possível excluir a empresa. Tente novamente.");
    throw error;
  }
}
