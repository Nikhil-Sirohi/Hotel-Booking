import { useState } from "react";
import axios from "axios";
import FormInput from "../components/FormInput";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      const newUserId = response.data.id;
      setMessage("Registration successful!");
      setUserId(newUserId);
      setFormData({ email: "", password: "" });
    } catch (error) {
      setMessage("Error during registration");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
      {userId && <p className="mt-2 text-center">Your User ID: {userId}</p>}
    </div>
  );
};

export default Register;
