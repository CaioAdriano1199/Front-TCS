"use client";
import { useState, useEffect } from "react";

import Sidemenu from "../componentes/sidemenu/sidemenu";
import StartContent from "../componentes/conteudomain/startcont";
import Chatcont from "../componentes/conteudomain/chatcont";

export default function Main() {


  return (
    <main className="flex min-h-screen bg-white">
      <Sidemenu className="flex-1"/>
    <Chatcont/>
    </main>
  );
}
