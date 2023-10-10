import { supabase } from "@supabase";
import React, { useState } from "react";

// Define the state type for the form data
interface FormState {
  email: string;
}

export const ResetPasswordForm: React.FC = () => {
  const initialFormState: FormState = {
    email: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo:
            "https://webpage-mywz8miv9-hananinas.vercel.app/account/update-password",
        }
      );

      if (error) {
        throw error;
      }

      // Display a success message
      setMessage("Password reset instructions sent to your email.");
      setShowMessage(true);
    } catch (error) {
      // Handle any errors that occur during the password reset request
      setMessage("An error occurred. Please check your email and try again.");
      setShowMessage(true);
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
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      {showMessage && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800">
          {message}
        </div>
      )}
      <form>
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            className="w-full p-2 border border-black text-black rounded"
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4">
          <button
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-300"
            onClick={handleSubmit}
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};
