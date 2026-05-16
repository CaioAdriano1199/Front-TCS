import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function criarPasta(novapasta) {
  try {
    const response = await fetch(`${BASE_URL}/folders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(novapasta)
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Pasta criada:", data);
      toast.success("Pasta criada com sucesso!");
      return data;
    }

    console.error("Erro da API:", data);
    toast.error(data.message || "Erro ao criar pasta. Tente novamente.");
  } catch (error) {
    console.error("Erro ao criar pasta:", error);
    toast.error("Erro ao criar pasta. Tente novamente.");
  }
}