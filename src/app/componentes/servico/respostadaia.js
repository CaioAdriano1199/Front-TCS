const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function respostadaia(pergunta) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/ia/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "bypass-tunnel-reminder": "true",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                description: pergunta,
                limit: 5
            })
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao obter resposta da IA");
        }

        return await resposta.json();
    } catch (error) {
        console.error("Erro ao obter resposta da IA:", error);
        throw error;
    }
}