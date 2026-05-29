import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

type Language = "en" | "de" | "fr";

interface GreetRequest {
  name: string;
  language: Language;
}

interface GreetResponse {
  greeting: string;
  language_used: Language;
}

function App() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [response, setResponse] = useState<GreetResponse | null>(null);

  async function greet() {
    const req: GreetRequest = { name, language };
    const res = await invoke<GreetResponse>("greet", { req });
    setResponse(res);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src="/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <select value={language} onChange={(e) => setLanguage(e.currentTarget.value as Language)}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
        </select>
        <button type="submit">Greet</button>
      </form>

      {response && (
        <div>
          <p>{response.greeting}</p>
          <small>language used: {response.language_used}</small>
        </div>
      )}
    </main>
  );
}

export default App;
