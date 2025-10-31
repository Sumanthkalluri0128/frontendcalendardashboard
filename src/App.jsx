import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
