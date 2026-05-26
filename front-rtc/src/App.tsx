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
  const [message, setMessage] = useState("");
  const [historique, setHistorique] = useState<string[]>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws?id=" + roomID);
    ws.onopen = () => console.log("Connecté");
    ws.onmessage = (event) => {
      setHistorique((ancienHistorique) => [...ancienHistorique, event.data]);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [roomID]);
  const envoyerMessage = () => {
    if (socket) {
      socket.send(JSON.stringify({ text: message, target: params.id }));
      setHistorique([...historique, message]);
      setMessage("");
    }
  };
  return (
    <div className="container">
      <div className="box">
        {historique.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className="messageBar">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={envoyerMessage}>Send</button>
      </div>
    </div>
  );
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
