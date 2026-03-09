import { useState, useEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import MovieHome from './pages/MovieHome'
import SeeAllMovies from './pages/SeeAllMovies'
import { useApp } from './context/MovieContext'
import DisplayPage from './pages/DisplayPage'


const MovieApp = () => {
  const { BASE_URL, buildURL, API_KEY } = useApp();
  const [searchedMovies, setSearchedMovies] = useState([])
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const location = useLocation()


  // now playing | top rated | trending ----------------------
  const ranOnce = useRef(false);
  useEffect(() => {
    if(ranOnce.current) return;
    if(searchedMovies !== null) return;
    if(location.pathname !== "/movie/moviehub") return;
    ranOnce.current = true; 

    setNowPlaying([]);
    setTopRated([]);
    setTrending([]);
    
    const load = async () => {
      
      try {
        const [nowPlaying, topRated, trending] = await Promise.all([
          fetch(buildURL(BASE_URL, "movie/now_playing"), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type" : "application/json"
            }
          }),
          fetch(buildURL(BASE_URL, 'movie/top_rated'), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type" : "application/json"
              
            }
          }),
          fetch(buildURL(BASE_URL, 'movie/popular'), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type" : "application/json"
            }
          })
        ]);
  
        const playingJson = await nowPlaying.json().catch(() => null);
        const topJson = await topRated.json().catch(() => null);
        const trendJson = await trending.json().catch(() => null);
  
        if(!nowPlaying.ok) {
          console.error("Now Playing Error: ", playingJson);
          return;
        }
        
        if(!trending.ok) {
          console.error("Trending Error: ", trendJson);
          return;
        }
  
        if(!topRated.ok) {
          console.error("Top Rated Error: ", topJson);
          return;
        }
  
        setNowPlaying(playingJson.results);
        setTopRated(topJson.results);
        setTrending(trendJson.results);

      } catch (error) {
        console.error("Failed to fetch: ", error.message);
        return;
      }

    }

    load()

    return () => {
      ranOnce.current = false
    }


  }, [searchedMovies])


  return (
    <>
        <Routes>
          <Route path='moviehub' element={
              <MovieHome 
                searchedMovies={searchedMovies} 
                setSearchedMovies={setSearchedMovies}
                nowPlaying={nowPlaying}
                topRated={topRated}
                trending={trending}
              />
          } />

          <Route path='moviehub/now-playing' element={
              <SeeAllMovies endPoint={'/movie/now_playing'} isFiltered={false}/>
          } />
          <Route path='moviehub/top-rated' element={
              <SeeAllMovies endPoint={'/movie/top_rated'} isFiltered={false}/>
          } />
          <Route path='moviehub/trending' element={
              <SeeAllMovies endPoint={'/movie/popular'} isFiltered={false}/>
          } />
          <Route path='moviehub/filtered-movies'  element={
              <SeeAllMovies endPoint={'/discover/movie'} isFiltered={true}/>
          }/>
          <Route path='moviehub/desc'  element={
              <DisplayPage />
          }/>
        </Routes> 
    </>
  )
}

export default MovieApp


// https://www.themoviedb.org/remote/panel?panel=trailer_scroller&group=in-theatres
// https://api.themoviedb.org/3/{genre}/movie/list
