const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberUsuarioPorId(usuarioId) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`
            }
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao receber usuário");
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao receber usuário:", error);
        throw error;
    }
}