 
 
 
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
      tipo: "arquivo",
      dataUpload: "2026-03-20"
    },
    {
      id: 2,
      nome: "pasta projeto",
      tipo: "pasta",
      arquivos: [
        {
          id: 5,
          nome: "documento.txt",
          tipo: "arquivo",
          dataUpload: "2026-03-19"
        },
        {
          id: 6,
          nome: "imagem.png",
          tipo: "arquivo",
          dataUpload: "2026-03-18"
        }
      ],
      dataUpload: "2026-03-18"
    },
    {
      id: 3,
      nome: "Planilha.xlsx",
      tipo: "arquivo",
      dataUpload: "2026-03-15"
    },
    {
      id: 4,
      nome: "Apresentacao",
      tipo: "pasta",
      arquivos: [
        {
          id: 7,
          nome: "slide1.png",
          tipo: "arquivo",
          dataUpload: "2026-03-10"
        },
        {
          id: 8,
          nome: "slide2.png",
          tipo: "arquivo",
          dataUpload: "2026-03-10"
        }
      ],
      dataUpload: "2026-03-10"
    }
  ];
}