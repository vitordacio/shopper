import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequestRide from "./pages/RequestRide";
import RideOptions from "./pages/RideOptions";
import RideHistory from "./pages/RideHistory";
import Logo from "./components/Logo/Shopper";

function App() {
  return (
    <Router>
      <div className="main-container">
        <Logo />
        <Routes>
          <Route path="/" element={<RequestRide />} />
          <Route path="/options" element={<RideOptions />} />
          <Route path="/history" element={<RideHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
