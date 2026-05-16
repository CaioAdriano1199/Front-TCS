const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function moverusuario(usuarioId, equipesIds) {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const resposta = await fetch(`${BASE_URL}/usuarios/sync-equipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                usuarioId: usuarioId,
                equipeIds: equipesIds
            })
        });
        if (!resposta.ok) {
            const errorData = await resposta.json();
            throw new Error(errorData.message || "Erro ao mover usuário");
        }
        const dados = await resposta.json();
        return dados;
    } catch (error) {
        console.error("Erro ao mover usuário:", error);
        throw error;
    }
}