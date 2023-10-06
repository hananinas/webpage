import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const SignInForm: React.FC = () => {
  return (
    <div className="bg-gray-600 p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form>
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border border-black text-black rounded"
            required
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
            className="w-full p-2 border text-black rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4">
        <p className="text-gray-600">or</p>
        <button className="mt-2 w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition duration-300">
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};
