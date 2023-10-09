import { supabase } from "@supabase";
import type { User } from "@supabase/supabase-js";
import React, { useState, type SetStateAction, useEffect } from "react";

// Define the state type for the form data
interface FormState {
  password: string;
}

export const UpdatePasswordForm: React.FC = () => {
  const initialFormState: FormState = {
    password: "",
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<SetStateAction<null | User>>(null);

  useEffect(() => {
    getUser();
    window.addEventListener("hashchange", function () {
      getUser();
    });
  }, []);

  //get user for current session
  async function getUser() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
      } else {
        window.location.href = "/login";
      }
    });
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        throw error;
      } else {
        window.location.href = "/account";
      }

      // Display a success message
      setMessage("Password changed");
      setShowMessage(true);
    } catch (error) {
      // Handle any errors
      setMessage("Password should not be old password try again");
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
          <label
            htmlFor="password"
            className="block text-white font-medium mb-2"
          >
            password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            className="w-full p-2 border border-black text-black rounded"
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4">
          <button
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition duration-300"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};
