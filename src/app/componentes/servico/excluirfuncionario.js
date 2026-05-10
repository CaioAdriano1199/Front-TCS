import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function excluirFuncionario(funcionarioId) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/usuarios/${funcionarioId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao excluir funcionário");
        }
    } catch (error) {
        console.error("Erro ao excluir funcionário:", error);
        throw error;
    }
}