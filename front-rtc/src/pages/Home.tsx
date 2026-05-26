// 1️⃣ Les imports obligatoires
import { useState } from "react";
import { useLocation } from "wouter";

function Home() {
  const [monId] = useState(() => crypto.randomUUID());
  const [, setLocation] = useLocation();

  const creerRoom = () => {
    sessionStorage.setItem("isHost", "true");
    setLocation("/room/" + monId);
  };

  return (
    <div className="container">
      <div className="createroom">
        <h1>{monId}</h1>
        <label htmlFor="newRoom"></label>
        <button onClick={creerRoom}>new room</button>
      </div>
    </div>
  );
}

export default Home;
