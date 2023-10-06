import React, { useState } from "react";
import { supabase } from "@supabase";

// Define the state type for the form data
interface FormState {
  title: string | null;
  author: string | null;
  abstract: string | null;
  votes: number | null;
}

export const NewPaperForm: React.FC = () => {
  // Initialize form state with empty values
  const initialFormState: FormState = {
    title: null,
    author: null,
    abstract: null,
    votes: null,
  };

  // Create state to hold the form data
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Make handleSubmit an async function
    e.preventDefault(); // Prevent the default form submission

    console.log(formData);

    try {
      const { data, error } = await supabase.from("papers").insert([
        {
          title: formData.title,
          abstract: formData.abstract,
          author: formData.author,
        },
      ]);

      if (error) {
        seterrorMessage(error.message);
        setShowError(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        console.error(error);
      } else {
        // Handle successful submission, e.g., reset the form
        setFormData(initialFormState);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
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
    <form
      onSubmit={handleSubmit}
      className="block max-2xl: w-[500px] rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
    >
      <div className="relative mb-6">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="relative mb-6">
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author || ""}
          className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="relative mb-6">
        <label htmlFor="abstract">Abstract:</label>
        <textarea
          id="abstract"
          name="abstract"
          value={formData.abstract || ""}
          className="peer block min-h-[auto] w-full rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          onChange={handleInputChange}
          required
        />
      </div>
      <button
        type="submit"
        className="inline-block w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
      >
        Submit
      </button>
      {showSuccess && (
        <div className="bg-green-200 p-3 mb-3 rounded-md text-green-800 mt-6">
          Success! Your paper has been submitted.
        </div>
      )}
      {showError && (
        <div className="bg-red-200 p-3 mb-3 rounded-md text-red-800 mt-6">
          {errorMessage}
        </div>
      )}
    </form>
  );
};
