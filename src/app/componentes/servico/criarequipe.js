import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function criarEquipe(equipeData) {
  try {
    const resposta = await fetch(`${BASE_URL}/equipes/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(equipeData)
    });


    console.log("Sucesso na criação da equipe");
    toast.success("Equipe criada com sucesso!");
  } catch (erro) {
    console.error("Erro:", erro);
    toast.error("Erro ao criar a equipe. Tente novamente.");
  }
}