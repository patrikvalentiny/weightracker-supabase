import { MainLayout } from "./layouts/MainLayout";
import { WeightInput } from "./components/WeightInput";

function App() {
  const handleWeightSubmit = (weight: number) => {
    // TODO: Handle weight submission
    console.log('Weight submitted:', weight);
  };

  return (
    <>
      <MainLayout />
      <WeightInput onSubmit={handleWeightSubmit} lastWeight={95} />
    </>
  );
}

export default App;