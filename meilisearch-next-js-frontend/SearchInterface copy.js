import React, { useState, useCallback } from "react";
import { debounce } from "lodash";

import SearchMovies from "./Assets/SearchMovies.png";
import Image from "next/image";
import { searchResourcesFromMelli } from "./MellisearchAPI";

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);

  const searchMelli = async (e) => {
    const melliSearch = {
      search: e,
    };

    const res = await searchResourcesFromMelli(melliSearch);
    setMoviesData(res);
    setSearchLoader(false);
  };

  const debouncedAPICall = useCallback(debounce(searchMelli, 1200), []);

  const debouncedFullTextSearch = (e) => {
    setSearchLoader(true);
    setQuery(e.target.value);
    debouncedAPICall(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="mt-5 ">
          <input
            value={query}
            onChange={debouncedFullTextSearch}
            placeholder="Search a movie..."
            className="border-1 border-blue-500 rounded-md px-2.5 py-3.5 bg-gray-100 text-black my-10 w-80 md:w-96"
          />
        </div>

        {searchLoader && (
          <div className="pt-7.5 mt-5 mb-7.5">
            <span>Loading...</span>
          </div>
        )}

        {moviesData?.length >= 1 ? (
          moviesData?.map((item) => (
            <div
              className="cursor-pointer my-4 shadow-md rounded-md w-11/12 md:w-96"
              key={item?.movieId}
            >
              <Image
                className=" w-full md:w-96 h-72 md:h-60 rounded-md"
                src={item.posterUrl}
                alt={item.title}
                width={400}
                height={400}
              />
              <div className="w-11/12 md:w-96 px-4">
                <div className="text-lg mb-1 leading-6.5 my-2">
                  {item.title}
                </div>
                <p className="text-base leading-6.5 mb-2.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            {!searchLoader && (
              <div className="flex flex-col items-center justify-center">
                <Image
                  src={SearchMovies}
                  alt="Search Movies"
                  width={400}
                  height={400}
                />
                <p className="text-xl my-2.5">Start typing to search movies!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInterface;
