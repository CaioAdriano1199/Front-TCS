 
 
 
export async function receberarquivos() {

 /* try {
    const resposta = await fetch("http://localhost:8081/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const dados = await resposta.json();

    return dados;
    console.log("Sucesso no cadastro do usuário");
  } catch (erro) {
    console.error("Erro:", erro);
  }
    */

   return [
    {
      id: 1,
      nome: "Contrato.pdf",
      tipo: "PDF",
      tamanho: "2.3 MB",
      dataUpload: "2026-03-20"
    },
    {
      id: 2,
      nome: "Foto.png",
      tipo: "Imagem",
      tamanho: "1.1 MB",
      dataUpload: "2026-03-18"
    },
    {
      id: 3,
      nome: "Planilha.xlsx",
      tipo: "Excel",
      tamanho: "980 KB",
      dataUpload: "2026-03-15"
    },
    {
      id: 4,
      nome: "Apresentacao.pptx",
      tipo: "PowerPoint",
      tamanho: "4.5 MB",
      dataUpload: "2026-03-10"
    }
  ];
}