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
        setLoading(false);
        console.log(value.data.user);
      } else {
        // Redirect the user to the login page
        window.location.href = "/account/login";
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

  function getVoteCount(paperId: number) {
    return votes.filter((vote) => vote.paper_id === paperId).length;
  }

  curPapers.data?.sort((a, b) => {
    const voteCountA = getVoteCount(a.id);
    const voteCountB = getVoteCount(b.id);

    // Sort in descending order (most votes first)
    return voteCountB - voteCountA;
  });

  // Sign out current user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <div className="ml-3 sm:ml-16 mr-16 sm:mr-3 font-mono ">
      {loading ? (
        // Show a loading spinner while fetching data
        <div className="text-center mt-4 flex justify-center items-center ">
          <div className="spinner-border text-white ml-14" role="status">
            <img
              src="https://media3.giphy.com/media/3S59TcvgxZK8kA45mu/giphy.gif?cid=ecf05e47rvx204hehcdqomolwsj3qps4i5qsmvn6hjrz4rq2&ep=v1_gifs_search&rid=giphy.gif&ct=g"
              width={500}
            />
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
            <div className="px-4 py-6">
              <h1>Username</h1>
              <p className="text-white-900">{userData.email}</p>
              <button
                className="border-white border-2 text-[16px] w-full h-[40px] mt-2"
                onClick={signOut}
              >
                Log out
              </button>
              <a href="/account/update-password">
                <button className="border-white border-2 text-[16px] w-full h-[40px] mt-2">
                  Change password
                </button>
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <h1>Paper history</h1>
            {papaperHistory.data?.map((paper, index) => (
              <div key={index} className="px-4 py-6">
                <h2 className="text-white-900">{paper.title}</h2>
                <p className="text-gray-700">{paper.abstract}</p>
                <a href={paper.link as string}>
                  <button className="border-white border-2 text-[16px] w-32 h-[40px] mt-2">
                    Go to paper
                  </button>
                </a>
              </div>
            ))}
            <a href="/papers" className="px-4 py-2 block text-white-900">
              View all
            </a>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <h1>Current papers</h1>
            {curPapers.data?.map((paper, index) => (
              <div key={index} className="px-4 py-6">
                <h2 className="text-white-900">{paper.title}</h2>
                <p className="text-gray-700">{paper.abstract}</p>
                <p className="text-purple-400">
                  Votes:{getVoteCount(paper.id)}
                </p>
                <div className="flex flex-row space-x-2">
                  <button
                    className="border-white border-2 text-[16px] w-24 h-[40px] mt-2"
                    onClick={() => voteNew(paper.id)}
                  >
                    Vote
                  </button>
                  <a href={paper.link as string}>
                    <button className="border-white border-2 text-[16px] w-32 h-[40px] mt-2">
                      Go to paper
                    </button>
                  </a>
                </div>
              </div>
            ))}
            <a href="/papers" className="px-4 py-2 block text-white-900">
              View all
            </a>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <a href="/submit">
              <button className="border-white border-2 text-[16px] w-full h-[40px]">
                Submit a new paper
              </button>
            </a>
          </div>
        </>
      )}
    </div>
  );
};
