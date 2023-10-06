import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import Card from "@components/Card";
import type { CollectionEntry } from "astro:content";
import type { BlogFrontmatter,EventFrontmatter, MemberFrontmatter } from "@content/_schemas";
import slugify from "@utils/slugify";

export type SearchItem = {
  title: string;
  description: string;
  tags: string[];
  authors: string[];
  data: BlogFrontmatter | EventFrontmatter | MemberFrontmatter;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["title", "description", "tags", "authors"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  });

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // put focus cursor at the end of the string
    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult = fuse.search(inputVal);
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.pushState(null, "", newRelativePathQuery);
    } else {
      history.pushState(null, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <>
      <label className="relative block">
        <input
          className="block w-full max-w-3xl my-4 rounded-lg  
 bg-background-secondary p-2
 placeholder:text-opacity-75 focus:border-accent focus:outline-none"
          placeholder="Filter for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
      </label>

      {inputVal.length == 0 ? (
        <div className="flex flex-col space-y-10">
          {searchList.map((item) => (
                <Card frontmatter={item.data} href={`/${item.data.format}/${slugify(item.data)}`} />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 text-secondary">
            Found {searchResults?.length}
            {searchResults?.length && searchResults?.length === 1
              ? " result"
              : " results"}{" "}
            for '{inputVal}'
          </div>
          <div className="flex flex-col space-y-10">
            {searchResults &&
              searchResults.map(({ item, refIndex }) => (
                <Card frontmatter={item.data} href={`/${item.data.format}/${slugify(item.data)}`} />
              ))}
          </div>
        </>
      )}
    </>
  );
}
