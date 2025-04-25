import { Hotel } from "../types/Hotel";

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotelId: number) => void;
  isSelected?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onSelect,
  isSelected = false,
}) => {
  return (
    <div
      className={`border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow ${
        isSelected ? "border-indigo-600 bg-indigo-50" : ""
      }`}
    >
      <h3 className="text-lg font-semibold">{hotel.name}</h3>
      <p className="text-sm text-gray-600">{hotel.location}</p>
      <p className="text-sm mt-2">{hotel.description}</p>
      <button
        onClick={() => onSelect(hotel.id)}
        className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Select Hotel
      </button>
    </div>
  );
};

export default HotelCard;
