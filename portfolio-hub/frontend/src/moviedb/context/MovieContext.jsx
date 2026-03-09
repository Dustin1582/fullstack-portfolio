import { createContext, useContext, useMemo, useRef, useState } from "react";

const MovieContext = createContext(null);


export const MovieProvider = ({ children }) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";
    const movieId = useRef();

    const buildURL = (baseURL, endPoint, page = "", language = "en", genre = [], year = "", rating = "") => {
        
        const isGenre = Array.isArray(genre) && genre.length > 0 ? true : false; 

        const url = new URL(`${baseURL}/${endPoint}`);
        if(page !== "") {
            url.searchParams.set('page', page.toString());
        }
        
        if(isGenre) {
            const moreThanOne = genre.length > 1 ? genre.map(e => e.id).join(',') : String(genre[0])
            url.searchParams.set('with_genres', `${moreThanOne}`)
        }

        if(typeof rating === "number" && rating !== 0) {
            url.searchParams.set("vote_average.gte", String(rating));
        }
        
        url.searchParams.set("primary_release_date.gte", '1920-01-01');
        
        if(year !== "" ) {
            url.searchParams.set("primary_release_date.lte", `${String(year)}-12-31`);
        }
        url.searchParams.set('language', language.toString())
        url.searchParams.set('include_adult', 'false');
        return url.toString();
    }

    const contextValue = useMemo(() => {
        return {
            API_KEY,
            BASE_URL,
            BASE_IMAGE_URL,
            movieId,
            buildURL
        }
    }, [API_KEY, BASE_URL, BASE_IMAGE_URL]);

    return <MovieContext.Provider value={contextValue}>{children}</MovieContext.Provider>
}


export function useApp() {
  const value = useContext(MovieContext);

  if (value === null) {
    throw new Error("useApp must be used inside <MovieProvider>.");
  }

  return value;
}

export default MovieContext
