"use client";
import { use } from "react";
import Card from "../componentes/card/card"

export default function Login() {
const [email, setEmail] =useState("");
const [password, setPassword] =useState("");

const infologin = {
  email: email,
  password: password
}

  return (

      <main className="flex min-h-screen flex-col items-center justify-center bg-white">

            <Card className="flex w-100 flex-col justify-center mt-6 bg-gray-500">
              <h1 className="self-center p-5 text-3xl font-semibold text-black">
            Relic
            </h1>
                
                <input
                  type="email"
                  placeholder="Email"
                  className="border bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border bg-white border-gray-300 rounded-md my-2.5 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-200 hover:bg-gray-170 my-2.5 text-black font-bold py-2 px-4 rounded-md"
                >
                  Login
                </button>
            </Card>
        </main>
  )
}