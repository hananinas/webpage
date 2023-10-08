import { supabase } from "@supabase";
import type { User } from "@supabase/supabase-js";
import react, { useState, type SetStateAction, useEffect } from "react";

export const LoginLink: React.FC = () => {
  const [user, setUser] = useState<SetStateAction<User | null>>(null);

  useEffect(() => {
    getUser();
    window.addEventListener("hashchange", function () {
      getUser();
    });
  });
  //get user for current session
  async function getUser() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        console.log(value.data.user);
      }
    });
  }

  return user ? (
    <a href="/account" className="nounderline">
      dashboard
    </a>
  ) : (
    <a href="/login" className="nounderline">
      login
    </a>
  );
};
