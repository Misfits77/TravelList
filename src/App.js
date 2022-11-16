import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import CreateTravelList from "./pages/createTravelList";

function App() {
  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/travel-list/new" element={<CreateTravelList />} />
      </Routes>
    </div>
  );
}

export default App;
