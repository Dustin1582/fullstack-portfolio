import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Body.css'
import MovieCard from './MovieCard'
import SearchFilter from './SearchFilter'

const Body = ({
  searchedMovies,
  nowPlaying,
  topRated,
  trending
}) => {
  const navigate = useNavigate();
  const searched_movies = searchedMovies?.results ?? null;
  const [page , setPage] = useState(1)
  
  // after every search switches back to page 1
  const ranOne = useRef(false)
  useEffect(() => {
    if(ranOne.current) return
    if(searched_movies === null) setPage(1) 
  }, [searched_movies])


  // only displays first 5 movies
  const setHomepageResults = (results) => {
    return results.slice(0, 5)
  }

  const handleSeeAllClick = (type) => {
    switch(type) {
      case "now":
        navigate("now-playing")
        break;
      case "rated":
        navigate("top-rated")
        break;
      case "trend":
        navigate("trending")
        break;
    }
  }

  // page layout for movies searches -----------------------------------
  const UI_PAGE_SIZE = 15;
  const {splitSection, remainder} = useMemo(() => {
    const list = Array.isArray(searched_movies) ? searched_movies : [];
    const startIndex = (page - 1) * UI_PAGE_SIZE;
    const pageItems = list.slice(startIndex, startIndex + UI_PAGE_SIZE) // 0, 15
    const group1 = pageItems.slice(0, 5)
    const group2 = pageItems.slice(5, 10)
    const group3 = pageItems.slice(10, 15)
    const remainder = list.slice(startIndex + UI_PAGE_SIZE) //15 (everything thats left)
    return { splitSection: [group1, group2, group3], remainder: remainder }
  }, [searched_movies, page])


  return (
    <div className='movie-body-main-container'>
      <div className="inner-movie-bc">
        {searched_movies !== null && (
          <>
            <div className="search-results-container">
              <div className="search-results-header">
                <div className="red-bar"></div>
                <h2>Results</h2>
              </div>
              <div className="search-results-body">
                <MovieCard results={searched_movies} 
                  isSearch={true} 
                  splitSection={splitSection}
                />
              </div>
            </div>
          </>
        )}
        {searched_movies === null && (
          <>
            <div className="recent-container">
              <div className="movie-header-ctr">
                <div className="redbar-header">
                  <div className="red-bar"></div>
                  <h2>Now Playing</h2>
                </div>
                <div className="seeAll-btn"
                  onClick={() => handleSeeAllClick('now')}
                >
                  <p>See All</p>
                </div>
              </div>
              <div className="movies-container">
                <MovieCard results={setHomepageResults(Array.isArray(nowPlaying) ? nowPlaying : [])}/>
              </div>
            </div>

            <div className="rated-container">
              <div className="movie-header-ctr">
                <div className="redbar-header">
                  <div className="red-bar"></div>
                  <h2>Top Rated</h2>
                </div>
                <div className="seeAll-btn"
                  onClick={() => {
                    handleSeeAllClick("rated")
                  }}
                >
                  <p>See All</p>
                </div>
              </div>
              <div className="movies-container">
                <MovieCard results={setHomepageResults(Array.isArray(topRated) ? topRated : [])}/>

              </div>
            </div>

            <div className="trending-container">
              <div className="movie-header-ctr">
                <div className="redbar-header">
                  <div className="red-bar"></div>
                  <h2>Trending</h2>
                </div>
                <div className="seeAll-btn"
                  onClick={() => {
                    handleSeeAllClick("trend")
                  }}
                >
                  <p>See All</p>
                </div>
              </div>
              <div className="movies-container">
                <MovieCard results={setHomepageResults(Array.isArray(trending) ? trending : [])}/>
              </div>
            </div>

          </>
        )}
        {searched_movies !== null && (
          <div className="search-button-ctr">
            {Array.from({ length: movies.total_pages}, (value, idx) => (
              <div className={`main-btn ${page === idx + 1 ? "page-btn-active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                <p>{(idx + 1).toString()}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="search-filters">
        <SearchFilter />
      </div>
    </div>
  )
}

export default Body
