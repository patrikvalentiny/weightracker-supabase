import { MainLayout } from "./layouts/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <AuthProvider>
        <div>
          <MainLayout />
        </div>
    </AuthProvider>
  );
}

export default App;