import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {useApp} from '../context/MovieContext.jsx'
import '../css/Header.css'


const Header = ({setSearchedMovies}) => {
    const { API_KEY, BASE_URL, BASE_IMAGE_URL } = useApp()
    const [ search, setSearch ] = useState('')
    const [ debounceSearch, setDebounceSearch ] = useState('')
    const location = useLocation();
    const nav = useNavigate();

    const ranOnce = useRef(false);


    //debouncing keystrokes so it does send a req every letter
    useEffect(() => {
        if(location.pathname !== "/movie/moviehub") return
        const timer = setTimeout(() => {
            setDebounceSearch(search.trim());
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search])

    //getting movie list based on debouned results
    useEffect(() => {
        if(ranOnce.current) return;
        if(location.pathname !== "/movie/moviehub") return

        if(!debounceSearch) {
            setSearchedMovies(null)
            return
        }
        ranOnce.current = true
        
        const url = new URL(`${BASE_URL}/search/movie`);
        url.searchParams.set("query", debounceSearch);
        url.searchParams.set("page", "1");
        url.searchParams.set("language", 'en-US')
        url.searchParams.set("include_adult", "false");

        const load = async () => {
            try {
                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    }
                });
    
                const json = await res.json().catch(() => null)
                
                if(!res.ok) {
                    console.error("Movie Home Fetch Error: ", json);
                    return
                }
                
                const cleaned = (json?.results ?? []).filter((m) => {
                    return Boolean(m.poster_path) && Boolean(m.release_date);
                });

                const pageSize =  15

                const cleanedJson = {
                    results : cleaned,
                    total_results: cleaned.length,
                    total_pages: Math.max(1, Math.ceil(cleaned.length / pageSize)) 
                }

                console.log("HEADER cleaned results: ", cleanedJson)

                setSearchedMovies(cleanedJson);
            } catch (error) {
                console.error("Movie Home Fetch Catch Error: ", error.message);
                return
            }
        }

        load();

        return () => {
            ranOnce.current = false
        }
    }, [debounceSearch])

  return (
    <div className='header-movie'>
        <div className="movie-header-title">
            <h1 className='movie-white'>Find Your Next</h1>
            <h1 className='movie-red'>Favorite Movie</h1>
        </div>
        <div className="movie-header-desc">
            <p>Search thousands of movies from OMDb</p>
        </div>
        <div className="search-container">
            <div className="search-bar">
                <img src={`${import.meta.env.BASE_URL}moviedb/magnifying-glass.svg`}/>
                <input 
                    type="text" 
                    name="movie" 
                    placeholder='Search for a movie...'
                    id="movie_search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    </div>
  )
}

export default Header
