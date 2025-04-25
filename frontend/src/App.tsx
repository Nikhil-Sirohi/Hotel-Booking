import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
