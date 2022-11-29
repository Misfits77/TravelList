import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateTravelList from "./pages/CreateTravelList";
import SeeTravelList from "./pages/SeeTravelList";
import EditTravelList from "./pages/EditTravelList";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/travel-list/new" element={<CreateTravelList />} />
        <Route path="/travel-list/:id" element={<SeeTravelList />} />
        <Route path="/travel-list/:id/edit" element={<EditTravelList />} />
      </Routes>
    </div>
  );
}

export default App;
