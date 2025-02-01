import { Switch, Route, Link, useLocation } from "wouter";
import { useState, useCallback, useEffect } from "react";
import { WeightsContext } from "../contexts/WeightsContext";
import { getWeights } from "../services/weights";
import Home from "../pages/Home";
import WeightList from "../pages/WeightList";
import Signup from "../pages/Signup";
import { WeightWithBMIModel } from "../types/WeightWithBMI";
import Login from "../pages/Login";
import UserDetails from "../pages/UserDetails";
import { signOut } from "../services/auth";
import { useAuth } from "../contexts/hooks/useAuth";
import ResetPassword from "../pages/ResetPassword";
import UpdatePassword from "../pages/UpdatePassword";

const RedirectToLogin = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/login');
  }, [setLocation]);
  
  return null;
};

const RedirectToSignup = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/signup');
  }, [setLocation]);
  
  return null;
};

const RedirectToHome = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/');
  }, [setLocation]);
  
  return null;
};

export function MainLayout() {
  const { user } = useAuth();
  const [weights, setWeights] = useState<WeightWithBMIModel[]>([]);
  const [location, setLocation] = useLocation();

  const refreshWeights = useCallback(async () => {
    const data = await getWeights();
    setWeights(data);
  }, []);

  useEffect(() => {
    refreshWeights();
  }, [refreshWeights]);

  const handleSignOut = async () => {
    await signOut();
    setLocation('/login');
  };

  if (!user) {
    return (
      <main className="flex flex-col items-center">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/update-password" component={UpdatePassword} />
          <Route path="/register" component={RedirectToSignup} />
          <Route component={RedirectToLogin} />
        </Switch>
      </main>
    );
  }

  return (
    <WeightsContext.Provider value={{ weights, refreshWeights }}>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar bg-base-200">
            <div className="flex-none">
              <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl font-semibold text-center w-full">Weight Tracker</Link>
            </div>
            <div className="flex-none">
              <button className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <main className="p-0.5 lg:p-4 flex flex-col items-center">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/weights" component={WeightList} />
              <Route path="/profile" component={UserDetails} />
              <Route path="/update-password" component={UpdatePassword} />
              <Route component={RedirectToHome} />
            </Switch>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="bg-base-200 flex flex-col min-h-full w-48">
            <div className="navbar bg-base-200 min-h-[4rem] px-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
              </svg>
              <span className="text-lg font-semibold ml-2">Weight Tracker</span>
            </div>
            <ul className="menu menu-bordered text-base-content p-4">
              <li>
                <Link 
                  className={`${location === '/' ? 'active border-l-4 border-primary' : ''}`} 
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  className={`${location === '/weights' ? 'active border-l-4 border-primary' : ''}`} 
                  href="/weights"
                >
                  Weights
                </Link>
              </li>
              <li>
                <Link 
                  className={`${location === '/profile' ? 'active border-l-4 border-primary' : ''}`} 
                  href="/profile"
                >
                  Profile
                </Link>
              </li>
            </ul>
            <div className="mt-auto p-4">
              <button 
                onClick={handleSignOut}
                className="btn btn-error btn-block btn-outline"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </WeightsContext.Provider>
  );
}
