import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">Hotel-Booking-App</div>
        <div className="space-x-6">
          <Link to="/register" className="text-white hover:text-gray-200">
            Register
          </Link>
          <Link to="/booking" className="text-white hover:text-gray-200">
            Book Hotel
          </Link>
          <Link to="/checkin" className="text-white hover:text-gray-200">
            Web Check-in
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
