import { Switch, Route, Link } from "wouter";
import Home from "../pages/Home";
import WeightList from "../pages/WeightList";

export function MainLayout() {
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
