import { type User } from "@supabase/supabase-js";
import { supabase } from "@supabase";
import react, { type SetStateAction, useEffect, useState } from "react";

interface UserState {
  email: string | undefined;
  id: string;
}

const papaperHistory = await supabase.from("papers").select("*");
const curPapers = await supabase.from("papers").select("*").eq("type", "new");

export const DashBoard: React.FC = () => {
  const initialUserInfo: UserState = {
    email: undefined,
    id: "",
  };

  const [user, setUser] = useState<SetStateAction<User | null>>(null);
  const [userData, setUserData] = useState<UserState>(initialUserInfo);
  const [loading, setLoading] = useState(true); // Loading state
  const [showSignInMessage, setShowSignInMessage] = useState(false);

  useEffect(() => {
    getUser();
    window.addEventListener("hashchange", function () {
      getUser();
    });
  }, []);

  const [votes, setVotes] = useState<
    { paper_id: number | null; vote: number | null; user_id: string }[]
  >([]);

  useEffect(() => {
    fetchVotes();

    window.addEventListener("votechange", function () {
      fetchVotes();
    });
  }, []);

  async function getUser() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        setUserData({ email: value.data.user.email, id: value.data.user.id });
        if (value.data === null) {
          setShowSignInMessage(true); // Set loading to false when data is fetched
        } else {
          setLoading(false);
        }
        console.log(value.data.user);
      }
    });
  }

  async function fetchVotes() {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("paper_id, vote, user_id");
      if (error) {
        throw error;
      }
      // Assuming data is an array of vote objects
      setVotes(data);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  }
  // vote new paper
  async function voteNew(paperID: number) {
    try {
      // Insert a vote record into the "votes" table
      const { data, error } = await supabase
        .from("votes")
        .upsert([{ paper_id: paperID, vote: 1, user_id: userData.id }]);

      if (error) {
        // Handle any errors here
        console.error("Error voting:", error);
      } else {
        // Handle successful vote
        console.log("Vote successful:", data);
        // You can update the UI or perform any other actions here
        fetchVotes();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  }

  // Sign out current user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <div className="ml-3 sm:ml-16 mr-16 sm:mr-3 font-mono">
      {loading ? (
        // Show a loading spinner while fetching data
        <div className="text-center mt-4">
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-white-900">
              User Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Personal details and Papers.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-white-900">
                  Username
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {userData.email}
                </dd>
                <button
                  className="border-white border-2  text-[16px] w-[300px] h-[40px]"
                  onClick={signOut}
                >
                  Log out
                </button>
              </div>
            </dl>
            <dl className="divide-y divide-gray-100">
              <h1>Paper history</h1>
              <div className="px-4 py-6 w-[300px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 sm:w-auto">
                <table className="border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-black-200">
                      <th className="border border-black-400 px-4 py-2">
                        Title
                      </th>
                      <th className="border border-black-400 px-4 py-2 ">
                        Abstract
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {papaperHistory.data?.map((paper, index) => (
                      <tr key={index}>
                        <td className="border border-purple-400 px-4 py-2">
                          {paper.title}
                        </td>
                        <td className="border border-purple-400 px-4 py-2">
                          {paper.abstract}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a href="/papers">
                <p>view all</p>
              </a>
            </dl>
            <dl className="divide-y divide-gray-100">
              <h1>Current papers</h1>
              <div className="px-4 py-6 w-[300px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 sm:w-auto ">
                <table className="border-collapse border border-gray-400 sm:w-[900px]">
                  <thead>
                    <tr className="bg-black-200">
                      <th className="border border-black-400 px-4 py-2">
                        Title
                      </th>
                      <th className="border border-black-400 px-4 py-2">
                        Abstract
                      </th>
                      <th className="border border-black-400 px-4 py-2">
                        votes
                      </th>
                      <th className="border border-black-400 px-4 py-2">
                        vote below
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {curPapers.data?.map((paper, index) => (
                      <tr key={index}>
                        <td className="border border-purple-400 px-4 py-2">
                          {paper.title}
                        </td>
                        <td className="border border-purple-400 px-4 py-2">
                          {paper.abstract}
                        </td>
                        <td className="border border-purple-400 px-4 py-2">
                          {
                            votes.filter((vote) => vote.paper_id === paper.id)
                              .length
                          }
                        </td>
                        <td className="w-[100px]">
                          <button
                            className="border-white border-2 text-[16px] w-[150px] h-[40px]"
                            onClick={() => voteNew(paper.id)}
                          >
                            vote
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a href="/papers">
                <p>view all</p>
              </a>
            </dl>
            <dl className="divide-y divide-gray-100">
              <a href="/submit">
                <button className="border-white border-2  text-[16px] w-[300px] h-[40px]">
                  Submit a new paper
                </button>
              </a>
            </dl>
          </div>
        </>
      )}

      {showSignInMessage && (
        <div className="bg-gray-600 p-8 rounded-lg shadow-lg w-96 mt-4">
          <p className="text-gray-100">You're not logged in </p>
          <div className="mt-4">
            <a href="/login">
              <button className="mt-2 w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition duration-300">
                Sign in
              </button>
            </a>
            <p className="text-gray-600">or</p>
          </div>
        </div>
      )}
    </div>
  );
};
