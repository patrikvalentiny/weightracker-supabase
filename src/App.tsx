import { MainLayout } from "./layouts/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDetailsProvider } from './contexts/UserDetailsContext';

function App() {

  return (
    <AuthProvider>
      <UserDetailsProvider>
        <div>
          <MainLayout />
        </div>
      </UserDetailsProvider>
    </AuthProvider>
  );
}

export default App;