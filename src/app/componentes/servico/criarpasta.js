const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function criarPasta(nomePasta, equipeId) {
  const response = await fetch(`${BASE_URL}/pastas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome: nomePasta, equipeId: equipeId })
  });

  return response.json();
}