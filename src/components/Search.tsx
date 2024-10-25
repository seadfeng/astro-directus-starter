import { useEffect, useRef, useState, type FormEvent } from "react";
import Card from "@components/Card"; 
import type { Posts } from "lib/directus";
import { stripHtmlTags } from "@utils/htmlUtils";
import { SITE } from "@config";
import he from "he";

export type SearchItem = {
  title: string;
  description: string;
  data: Posts;
  slug: string;
};

interface Props {
  initialSearchList: SearchItem[];
}

export default function SearchBar({ initialSearchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchList, setSearchList] = useState<SearchItem[]>(initialSearchList);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(() => {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (inputVal.length > 1) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(inputVal)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
          const posts: Posts[] = await response.json();
          const searchList = posts.map((post) =>{ 
            const decodedContent = he.decode(post.content); 
            let description = stripHtmlTags(decodedContent).slice(0, SITE.postTruncateLength);
            if(description.length >= SITE.postTruncateLength) description += "...";
            return {
              title: post.title,
              description,
              data: post,
              slug: post.slug,
          }});
          setSearchList(searchList);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchList(initialSearchList);
      }

      const searchParams = new URLSearchParams(window.location.search);
      if (inputVal.length > 0) {
        searchParams.set("q", inputVal);
        const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
        history.replaceState(history.state, "", newRelativePathQuery);
      } else {
        history.replaceState(history.state, "", window.location.pathname);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputVal, initialSearchList]);

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
          <span className="sr-only">Search</span>
        </span>
        <input
          className="block w-full rounded border border-skin-fill/40 bg-skin-fill py-3 pl-10 pr-3 placeholder:italic focus:border-skin-accent focus:outline-none"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {isLoading && <div className="mt-4">Loading...</div>}

      {inputVal.length > 1 && !isLoading && (
        <div className="mt-8">
          Found {searchList.length}
          {searchList.length === 1 ? " result" : " results"} for '{inputVal}'
        </div>
      )}

      <ul>
        {searchList.map((item) => (
          <Card
            href={`/posts/${item.slug}/`}
            frontmatter={item.data}
            key={item.slug}
          />
        ))}
      </ul>
    </>
  );
}
