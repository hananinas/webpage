import { supabase } from "@supabase";
import type { User } from "@supabase/supabase-js";
import react, { type SetStateAction } from "react";
import { useState, useEffect } from "react";

interface UserState {
  email: string | undefined;
}

export const DashBoard: React.FC = () => {
  const initialUserInfo: UserState = {
    email: undefined,
  };

  const [user, setUser] = useState<SetStateAction<User | null>>(null);
  const [userData, setUserData] = useState<UserState>(initialUserInfo);

  useEffect(() => {
    getUser();
    window.addEventListener("hashchange", function () {
      getUser();
    });
  });

  async function getUser() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        setUserData({ email: value.data.user.email });
        console.log(value.data.user);
      }
    });
  }

  //sign out current user
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <div className="ml-3 sm:ml-16 mr-16 sm:mr-3 font-mono">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-white-900">
          User Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Personal details and Listings.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Username
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.email}
            </dd>
            <button
              className="border-black border-2  text-[16px] w-[300px] h-[40px]"
              onClick={signOut}
            >
              log out
            </button>
          </div>
        </dl>
        <dl className="divide-y divide-gray-100">
          <h1>Paper history</h1>
          <div className="px-4 py-6 w-[300px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 sm:w-auto"></div>
        </dl>
        <h1 className="text-[30px]">Current papers </h1>

        <a href="/submit">
          <button className="border-black border-2  text-[16px] w-[300px] h-[40px]">
            Submit a new paper
          </button>
        </a>
      </div>
    </div>
  );
};
