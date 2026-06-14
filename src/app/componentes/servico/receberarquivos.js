const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberarquivos(path) {
  try {
    if (!path) {
      return { subpastas: [], arquivos: [] };
    }

    const resposta = await fetch(`${BASE_URL}/folders/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ path })
    });

    if (!resposta.ok) {
      const errorData = await resposta.json();
      console.error("Erro ao receber arquivos:", errorData);
      return { subpastas: [], arquivos: [] };
    }
    console.log("Status:", resposta.status);
    const dados = await resposta.json();
    console.log("Resposta folders/content:", dados);
    return dados;
  } catch (erro) {
    console.error("Erro:", erro);
    return { subpastas: [], arquivos: [] };
  }
} 