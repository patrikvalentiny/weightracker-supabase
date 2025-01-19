import { Switch, Route, Link } from "wouter";
import { useState, useCallback, useEffect } from "react";
import { WeightsContext } from "../contexts/WeightsContext";
import { getWeights } from "../services/weights";
import Home from "../pages/Home";
import WeightList from "../pages/WeightList";
import Signup from "../pages/Signup";
import { WeightWithBMIModel } from "../types/WeightWithBMI";
import Login from "../pages/Login";

export function MainLayout() {
  const [weights, setWeights] = useState<WeightWithBMIModel[]>([]);

  const refreshWeights = useCallback(async () => {
    const data = await getWeights();
    setWeights(data);
  }, []);

  useEffect(() => {
    refreshWeights();
  }, [refreshWeights]);

  return (
    <WeightsContext.Provider value={{ weights, refreshWeights }}>
      <div>
        <nav>
          <Link href="/">Home</Link> | 
          <Link href="/weights">Weights</Link> |
          <Link href="/signup">Sign Up</Link>
        </nav>
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/weights" component={WeightList} />
            <Route path="/signup" component={Signup} />
            <Route path="/register">
              {() => {
                window.location.href = '/signup';
                return null;
              }}
            </Route>
            <Route path="/login" component={Login} />
          </Switch>
        </main>
      </div>
    </WeightsContext.Provider>
  );
}
