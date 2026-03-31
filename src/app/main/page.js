"use client";
import { useState, useEffect } from "react";

import Sidemenu from "../componentes/sidemenu/sidemenu";
import StartContent from "../componentes/conteudomain/startcont";
import Chatcont from "../componentes/conteudomain/chatcont";

export default function Main() {
  const [pgc, setPgc] = useState(0);

  return (
    <main className="flex min-h-screen bg-white">
      <Sidemenu className="flex-1" setPgc={setPgc}/>
      {pgc === 0 && ( <StartContent/>)}
      {pgc === 1 && (<Chatcont/>)}
      {pgc === 2 && <div className="text-black">Conteúdo da página 3</div>}
      {pgc === 3 && <div className="text-black">Conteúdo da página 4</div>}
    </main>
  );
}
