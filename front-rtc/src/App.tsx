import { useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import "./App.css";

function Home() {
  const [monId] = useState(() => crypto.randomUUID());
  const [location, setLocation] = useLocation();
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

function Chat({ params }: { params: { id: string } }) {
  const isHost = sessionStorage.getItem("isHost");
  const [roomID] = useState(() => {
    if (isHost) {
      return params.id;
    } else {
      return crypto.randomUUID();
    }
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws?id=" + roomID);
    ws.onopen = () => console.log("Connecté");
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [roomID]);

  return <div>Attente {params.id}</div>;
}

function App() {
  return (
    <div>
      <Route path="/room/:id" component={Chat} />
      <Route path="/" component={Home} />
    </div>
  );
}

export default App;
