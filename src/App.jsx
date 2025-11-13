import { ActionsProvider } from "./context/ActionsContext";
import { Dashboard } from "../src/views/Dashborard/Dashboard";

function App() {
  return (
    <ActionsProvider>
      <Dashboard />
    </ActionsProvider>
  );
}

export default App;
