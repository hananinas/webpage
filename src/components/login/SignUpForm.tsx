import { supabase } from "@supabase";
import React, { useState } from "react";

interface FormState {
  email: string;
  password: string;
}

export const SignUpForm: React.FC = () => {
  const initialFormState: FormState = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        setShowMessage(true);
        setMessage("Conformation sent to your email " + data.user?.email + ".");
        setTimeout(() => {
          setShowMessage(false);
          window.location.href = "/account/login";
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update the corresponding property in the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-gray-600 p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form>
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email || ""}
            className="w-full p-2 border border-black text-black rounded"
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-white-700 font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ""}
            className="w-full p-2 border text-black rounded"
            onChange={handleInputChange}
          />
        </div>
        <button
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-300"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
      </form>
      {showMessage && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800">
          {message}
        </div>
      )}
      {showError && (
        <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
