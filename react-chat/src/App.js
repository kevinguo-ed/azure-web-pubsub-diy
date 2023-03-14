import "./App.css";
import { useState } from "react";

function UserChat({ from, message }) {
  return (
    <div className="align-self-start">
      <small className="text-muted font-weight-light">from {from}</small>
      <p className="alert alert-primary text-break">{message}</p>
    </div>
  );
}

function SelfChat({ message }) {
  return <div className="align-self-end alert-success alert">{message}</div>;
}

function App() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [connected, setConnected] = useState(false);

  function connect() {
    setConnected(true);
  }

  function send() {
    const chat = {
      from: user,
      message: message,
    };
    setChats((prev) => [...prev, chat]);
  }

  const loginPage = (
    <div className="d-flex h-100 flex-column justify-content-center container">
      <div className="input-group m-3">
        <input autoFocus type="text" className="form-control" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)}></input>
        <div className="input-group-append"><button className="btn btn-primary" type="button" disabled={!user} onClick={connect}>Connect</button></div>
      </div>
    </div>
  );
  const messagePage = (
    <div className="h-100 container">
      <div className="input-group m-3">
        <input autoFocus type="text" className="form-control" placeholder={`Hi ${user}, type a message`} value={message} onChange={(e) => setMessage(e.target.value)}></input>
        <div className="input-group-append"><button className="btn btn-primary" type="button" onClick={send}>Send</button></div>
      </div>
      <div className="chats d-flex flex-column m-2 p-2 bg-light h-100 overflow-">
        {chats.map((item, index) => 
          item.from === user ? 
          <SelfChat key={index} message={item.message} />
          : <UserChat key={index} from={item.from} message={item.message} />)}
      </div>
    </div>
  );
  return !connected ? loginPage : messagePage;
}

export default App;
