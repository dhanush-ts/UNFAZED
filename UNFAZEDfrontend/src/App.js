import { Header } from "./Layout/Header";
import { AllRoutes } from "./routes/AllRoutes";

function App() {
  return (
    <div className="dark:text-slate-100 min-h-screen dark:bg-gray-600">
      <Header />
      <AllRoutes />
    </div>
  );
}

export default App;
