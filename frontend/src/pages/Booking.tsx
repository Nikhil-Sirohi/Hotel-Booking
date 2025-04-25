import { useState, useEffect } from "react";
import axios from "axios";
import HotelCard from "../components/HotelCard";
import FormInput from "../components/FormInput";
import { Hotel } from "../types/Hotel";

const Booking: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    user_id: "1",
    check_in_date: "",
    check_out_date: "",
    num_members: "",
  });
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/hotels`
        );
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setHotels(response.data);
        } else if (response.data && Array.isArray(response.data.hotels)) {
          setHotels(response.data.hotels);
        } else {
          setMessage("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setMessage("Failed to fetch hotels. Check json-server.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) {
      setMessage("Please select a hotel");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          user_id: parseInt(formData.user_id),
          hotel_id: selectedHotel,
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          num_members: parseInt(formData.num_members),
        }
      );
      const newBookingId = response.data.id;
      setMessage("Booking successful!");
      setBookingId(newBookingId);
      setFormData({
        user_id: "1",
        check_in_date: "",
        check_out_date: "",
        num_members: "",
      });
      setSelectedHotel(null);
    } catch (error) {
      setMessage("Error creating booking");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Book a Hotel</h2>
      {loading && <p className="text-center">Loading hotels...</p>}
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      {bookingId && (
        <p className="mt-2 text-center">Your Booking ID: {bookingId}</p>
      )}
      {!loading && hotels.length === 0 && !message && (
        <p className="text-center">No hotels available</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Hotels</h3>
          <div className="space-y-4">
            {hotels && hotels.length > 0 ? (
              hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onSelect={setSelectedHotel}
                  isSelected={selectedHotel === hotel.id}
                />
              ))
            ) : (
              <p>No hotels to display</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <FormInput
              label="User ID"
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Check-in Date"
              type="date"
              name="check_in_date"
              value={formData.check_in_date}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Check-out Date"
              type="date"
              name="check_out_date"
              value={formData.check_out_date}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Number of Members"
              type="number"
              name="num_members"
              value={formData.num_members}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
