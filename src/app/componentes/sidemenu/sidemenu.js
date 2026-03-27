"use client";

export default function Sidemenu({ setPgc }) {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold">
                Relic
            </div>
            <nav className="flex flex-col mt-4">
                <a onClick={() => setPgc(0)} className="px-4 py-2 hover:bg-gray-700">Principal</a>
                <a onClick={() => setPgc(1)} className="px-4 py-2 hover:bg-gray-700">Cadastro</a>
                <a onClick={() => setPgc(2)} className="px-4 py-2 hover:bg-gray-700">Login</a>
            </nav>
            <div className="mt-auto p-4 text-sm text-gray-400">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                }}
                className="w-full self-start text-white font-bold py-2 px-4 rounded-md"
              >
                Sair
              </button>
                
            </div>
        </div>
    );
}
