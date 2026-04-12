 
 const BASe_URL = process.env.NEXT_PUBLIC_BASE_URL;
 
export async function receberEquipes() {

 /* try {
    const resposta = await fetch(`${BASe_URL}/usuarios`, {
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
      membros: [{id: 10, nome: "Alice", email: "alice@example.com", senha: "senha123" }, { id: 20, nome: "Bob", email: "bob@example.com", senha: "senha456" }, { id: 30, nome: "Charlie", email: "charlie@example.com", senha: "senha789" }],
      dataUpload: "2026-03-20"
    },
    {
      id: 2,
      nome: "Equipe B",
      membros: [{ id: 1, nome: "David", email: "david@example.com", senha: "senha123" }, { id: 2, nome: "Eve", email: "eve@example.com", senha: "senha456" }, { id: 3, nome: "Frank", email: "frank@example.com", senha: "senha789" }],
      dataUpload: "2026-03-18"
    },
    {
      id: 3,
      nome: "Equipe C",
      membros: [{id: 100, nome: "Grace", email: "grace@example.com", senha: "senha123" }, { id: 200, nome: "Henry", email: "henry@example.com", senha: "senha456" }, { id: 300, nome: "Ivy", email: "ivy@example.com", senha: "senha789" }],
      dataUpload: "2026-03-15"
    },
    {
      id: 4,
      nome: "Equipe D",
      membros: [{ id: 1000, nome: "Jack", email: "jack@example.com", senha: "senha123" }, { id: 2000, nome: "Kate", email: "kate@example.com", senha: "senha456" }, { id: 3000, nome: "Liam", email: "liam@example.com", senha: "senha789" }],
      dataUpload: "2026-03-10"
    }
  ];
}