import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadArquivo(destinationPath, file) {
  if (!destinationPath) {
    throw new Error(" Caminho de destino não informado para o upload.");
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("destinationPath", destinationPath);
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/arquivos/upload`, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    toast.error("Erro ao fazer upload do arquivo. Tente novamente.");
    throw new Error(error.message || "Erro no upload");
  }

  toast.success("Arquivo enviado com sucesso!");
  return response.json();
} 