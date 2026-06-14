import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function downloadArquivo(path) {
  if (!path) {
    throw new Error("Caminho do arquivo não informado para download.");
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await fetch(`${BASE_URL}/arquivos/download?path=${encodeURIComponent(path)}`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    let errorMessage = "Erro ao baixar o arquivo.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // resposta sem corpo JSON
    }
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const contentType = response.headers.get("Content-Type") || blob.type || "application/octet-stream";
  const contentDisposition = response.headers.get("Content-Disposition") || "";

  return {
    blob,
    contentType,
    contentDisposition
  };
}
