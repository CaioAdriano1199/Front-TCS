 
 const BASe_URL = process.env.NEXT_PUBLIC_BASE_URL;
 
export async function receberarquivos() {

 /* try {
    const resposta = await fetch(`${BASe_URL}/usuarios`, {
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
      dataUpload: "2026-03-20 10:30:00"
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
          dataUpload: "2026-03-19 14:45:00"
        },
        {
          id: 6,
          nome: "imagem.png",
          tipo: "arquivo",
          dataUpload: "2026-03-18 09:20:00"
        }
      ],
      dataUpload: "2026-03-18 00:00:00"
    },
    {
      id: 3,
      nome: "Planilha.xlsx",
      tipo: "arquivo",
      dataUpload: "2026-03-15 12:00:00"
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
          dataUpload: "2026-03-10 09:00:00"
        },
        {
          id: 8,
          nome: "slide2.png",
          tipo: "arquivo",
          dataUpload: "2026-03-10 09:05:00"
        }
      ],
      dataUpload: "2026-03-10 00:00:00"
    }
  ];
}