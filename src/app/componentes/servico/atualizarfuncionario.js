const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function atualizarFuncionario(funcionarioId, funcionarioData) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/usuarios/update-worker/${funcionarioId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(funcionarioData)
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao atualizar funcionário");
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao atualizar funcionário:", error);
        throw error;
    }
}