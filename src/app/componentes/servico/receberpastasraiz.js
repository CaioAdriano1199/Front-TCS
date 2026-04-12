const BASe_URL = process.env.NEXT_PUBLIC_API_URL;

export async function receberPastasRaiz() {
try {
    const resposta = await fetch(`${BASe_URL}/folders/roots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const dados = await resposta.json();
    return dados;
    } catch (erro) {
    console.error("Erro:", erro);
  }
}