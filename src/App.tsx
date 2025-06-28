import LoginBar from "./components/github/LoginBar";
import { SwaggerEditor } from "./components/swagger";

function App() {
  return (
    <div className="flex flex-col fixed w-full h-full max-w-full max-h-full">
      <LoginBar />
      <SwaggerEditor />
    </div>
  );
}

export default App;
