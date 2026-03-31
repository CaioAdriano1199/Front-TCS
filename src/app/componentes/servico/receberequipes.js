 
 
 
export async function receberEquipes() {

 /* try {
    const resposta = await fetch("http://localhost:8081/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const dados = await resposta.json();

    return dados;
    console.log("Lista de equipes recebida com sucesso");
  } catch (erro) {
    console.error("Erro:", erro);
  }
    */

   return [
    {
      id: 1,
      nome: "Equipe A",
      membros: [{ nome: "Alice" }, { nome: "Bob" }, { nome: "Charlie" }

      ],
      dataUpload: "2026-03-20"
    },
    {
      id: 2,
      nome: "Equipe B",
      membros: [{ nome: "David" }, { nome: "Eve" }, { nome: "Frank" }],
      dataUpload: "2026-03-18"
    },
    {
      id: 3,
      nome: "Equipe C",
      membros: [{ nome: "Grace" }, { nome: "Henry" }, { nome: "Ivy" }],
      dataUpload: "2026-03-15"
    },
    {
      id: 4,
      nome: "Equipe D",
      membros: [{ nome: "Jack" }, { nome: "Kate" }, { nome: "Liam" }],
      dataUpload: "2026-03-10"
    }
  ];
}