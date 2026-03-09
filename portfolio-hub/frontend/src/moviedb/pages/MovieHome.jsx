import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import '../css/MovieHome.css'
import Header from '../components/Header';
import Body from '../components/Body';

const MovieHome = ({
    searchedMovies, 
    setSearchedMovies,
    nowPlaying,
    topRated,
    trending

}) => {
    const [movies, setMovies] = useState(null);

    if(movies !== null) {
        console.log("movies: ", movies)
    }


  return (
    <div className="body-container">
        <div className='movie-main-container' style={{backgroundImage: `url(${import.meta.env.BASE_URL}moviedb/movie_background.png)`}}>
            <Header setSearchedMovies={setSearchedMovies}/>
            <Body 
                searchedMovies={searchedMovies}
                nowPlaying={nowPlaying}
                topRated={topRated}
                trending={trending}
            />
        </div>
    </div>
  )
}

export default MovieHome
