 
 const BASe_URL = process.env.NEXT_PUBLIC_API_URL;
 
export async function receberarquivos(folderId) {

  try {
    const resposta = await fetch(`${BASe_URL}/folders/content/${folderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const dados = await resposta.json();

    return dados;
    console.log("Sucesso no cadastro do usuário");
  } catch (erro) {
    console.error("Erro:", erro);
  }
    

  
}