import { Switch, Route, Link } from "wouter";
import { useState, useCallback, useEffect } from "react";
import { WeightsContext } from "../contexts/WeightsContext";
import { getWeights } from "../services/weights";
import { Weight } from "../types/weight";
import Home from "../pages/Home";
import WeightList from "../pages/WeightList";

export function MainLayout() {
  const [weights, setWeights] = useState<Weight[]>([]);

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
          <Link href="/weights">Weights</Link>
        </nav>
        <main>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/weights" component={WeightList} />
          </Switch>
        </main>
      </div>
    </WeightsContext.Provider>
  );
}
