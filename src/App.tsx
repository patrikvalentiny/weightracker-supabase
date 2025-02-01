import { MainLayout } from "./layouts/MainLayout";
import { AuthProvider } from "./contexts/AuthProvider";
import { UserDetailsProvider } from './contexts/UserDetailsProvider';

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