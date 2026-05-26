import { useEffect, useState } from "react";
import { useLocation } from "wouter";

function Chat({ params }: { params: { id: string } }) {
  const isHost = sessionStorage.getItem("isHost");
  const [, setLocation] = useLocation(); // L'outil de téléportation

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [historique, setHistorique] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws?id=" + params.id);
    ws.onopen = () => console.log("Connecté");

    ws.onmessage = (event) => {
      try {
        const enveloppe = JSON.parse(event.data);
        if (enveloppe.type === "CHAT") {
          setHistorique((ancien) => [...ancien, enveloppe.content]);
        } else if (enveloppe.type === "DESTROY") {
          setLocation("/");
        }
      } catch (e) {
        setHistorique((ancien) => [...ancien, event.data]);
      }
    };

    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [params.id, setLocation]);

  const envoyerMessage = () => {
    if (socket && message.trim() !== "") {
      const enveloppe = JSON.stringify({ type: "CHAT", content: message });
      socket.send(JSON.stringify({ text: enveloppe, target: params.id }));
      setHistorique([...historique, message]);
      setMessage("");
    }
  };

  const suppRoom = () => {
    if (socket) {
      const enveloppe = JSON.stringify({ type: "DESTROY" });
      socket.send(JSON.stringify({ text: enveloppe, target: params.id }));
      setLocation("/");
    }
  };

  return (
    <div className="container">
      <h2>
        Salle : {params.id} {isHost ? "👑" : "👤"}
      </h2>

      <div className="box">
        {historique.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <div className="messageBar">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={envoyerMessage}>Send</button>
        <button onClick={suppRoom}>Supprimer</button>
      </div>
    </div>
  );
}

export default Chat;
