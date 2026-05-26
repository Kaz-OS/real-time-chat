import { Route } from "wouter";
import "./App.css";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Route path="/room/:id" component={Chat} />
      <Route path="/" component={Home} />
    </div>
  );
}

export default App;
