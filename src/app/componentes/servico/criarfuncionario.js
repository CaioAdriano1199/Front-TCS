const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function criarFuncionario(funcionarioData) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/usuarios/create-new-worker`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(funcionarioData)
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao criar funcionário");
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao criar funcionário:", error);
        throw error;
    }
}