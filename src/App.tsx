import { MainLayout } from "./layouts/MainLayout";
import { UserDetailsProvider } from './contexts/UserDetailsContext';

function App() {

  return (

    <UserDetailsProvider>
      <div>
        <MainLayout />
      </div>
    </UserDetailsProvider>
  );
}

export default App;