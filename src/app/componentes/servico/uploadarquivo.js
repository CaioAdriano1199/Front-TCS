import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadArquivo(folderId, file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("folderId", folderId);
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/arquivos/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro no upload");
    toast.error("Erro ao fazer upload do arquivo. Tente novamente.");
  }

  toast.success("Arquivo enviado com sucesso!");
  return response.json();
}