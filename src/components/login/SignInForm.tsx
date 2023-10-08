import { supabase } from "@supabase";
import { type Session, type User } from "@supabase/supabase-js";
import React, { type SetStateAction } from "react";
import { useState, useEffect } from "react";
import { AiOutlineGoogle } from "react-icons/ai";

// source https://supabase.com/docs/guides/
// Define the state type for the form data
interface FormState {
  email: string | null;
  password: string | null;
}

export const SignInForm: React.FC = () => {
  const initialFormState: FormState = {
    email: null,
    password: null,
  };

  // cons
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showError, setShowError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  // for outh
  const [user, setUser] = useState<SetStateAction<null | User>>(null);

  useEffect(() => {
    getUser();
    window.addEventListener("hashchange", function () {
      getUser();
    });
  }, []);

  //get session for current user
  async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    setSession(data.session);
  }

  //get user for current session
  async function getUser() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        console.log(value.data.user);
      }
    });
  }

  //sign out current user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setUser(null);
  }

  //sign in with github
  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Make handleSubmit an async function
    e.preventDefault(); // Prevent the default form submission

    console.log(formData);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email || "",
      password: formData.password || "",
    });
    setUser(data.user);

    window.location.href = "/account";
    if (error) {
      seterrorMessage(error.message);
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 5000);
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

    console.log(formData);
  };

  return !user ? (
    <div className="bg-gray-600 p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={handleSubmit}
        >
          Sign In
        </button>

        <button
          className="flex flex-row justify-center items-center mt-6 w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition duration-300"
          onClick={signOut}
        >
          Sign in with Google
        </button>
        {showError && (
          <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6">
            {errorMessage}
          </div>
        )}
      </form>
      <button
        className="flex flex-row justify-center items-center mt-6 w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition duration-300"
        onClick={signInWithGithub}
      >
        Sign in with Github
      </button>
    </div>
  ) : (
    <div className="bg-gray-600 p-8 rounded-lg shadow-lg w-96">
      <p className="text-gray-100">You're signed in.</p>
      <div className="mt-4">
        <button
          className="mt-2 w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition duration-300"
          onClick={signOut}
        >
          Sign out
        </button>
        <p className="text-gray-600">or</p>
      </div>
    </div>
  );
};
