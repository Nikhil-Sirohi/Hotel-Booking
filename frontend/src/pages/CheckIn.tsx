import { useState } from "react";
import axios from "axios";
import FormInput from "../components/FormInput";

const CheckIn: React.FC = () => {
  const [formData, setFormData] = useState({
    booking_id: "",
    num_members: "",
  });
  const [aadhaarNumbers, setAadhaarNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "num_members") {
      const count = parseInt(e.target.value) || 0;
      setAadhaarNumbers(new Array(count).fill(""));
    }
  };

  const handleAadhaarChange = (index: number, value: string) => {
    const newAadhaarNumbers = [...aadhaarNumbers];
    newAadhaarNumbers[index] = value;
    setAadhaarNumbers(newAadhaarNumbers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumbers.some((num) => !num)) {
      setMessage("Please enter all Aadhaar numbers");
      return;
    }
    try {
      const checkIns = aadhaarNumbers.map((aadhaar) => ({
        booking_id: parseInt(formData.booking_id),
        aadhaar_number: aadhaar,
      }));
      await Promise.all(
        checkIns.map((checkIn) =>
          axios.post(`${import.meta.env.VITE_API_URL}/checkins`, checkIn)
        )
      );
      setMessage("Check-in successful!");
      setFormData({ booking_id: "", num_members: "" });
      setAadhaarNumbers([]);
    } catch (error) {
      setMessage("Error during check-in");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Web Check-in</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Booking ID"
          type="number"
          name="booking_id"
          value={formData.booking_id}
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
        {aadhaarNumbers.map((aadhaar, index) => (
          <FormInput
            key={index}
            label={`Aadhaar Number ${index + 1}`}
            type="text"
            name={`aadhaar-${index}`}
            value={aadhaar}
            onChange={(e) => handleAadhaarChange(index, e.target.value)}
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Check-in
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default CheckIn;
