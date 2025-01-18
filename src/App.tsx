import { Route, Switch, Link } from "wouter";
import { useEffect, useState } from "react";
import { Weight } from "./types/weight";
import { getWeights } from "./services/weights";

function Layout() {
  return (
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
  );
}

function Home() {
  return <h1>Welcome to Weight Tracker</h1>;
}

function WeightList() {
  const [weights, setWeights] = useState<Weight[]>([]);

  useEffect(() => {
    fetchWeights();
  }, []);

  async function fetchWeights() {
    const data = await getWeights();
    setWeights(data);
  }

  return (
    <ul>
      {weights.map((weight) => (
        <li key={weight.created_at}>{weight.weight}</li>
      ))}
    </ul>
  );
}

function App() {
  return <Layout />;
}

export default App;