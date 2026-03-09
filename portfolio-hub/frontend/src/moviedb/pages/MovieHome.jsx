import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import Body from '../components/Body';
import '../css/MovieHome.css'


const MovieHome = ({
    searchedMovies, 
    setSearchedMovies,
    nowPlaying,
    topRated,
    trending

}) => {
    const nav = useNavigate();
    const [movies, setMovies] = useState(null);

    if(movies !== null) {
        console.log("movies: ", movies)
    }


  return (
    <div className="body-container">
        <div className='movie-main-container' style={{backgroundImage: `url(${import.meta.env.BASE_URL}moviedb/movie_background.png)`}}>
            <div className="back-button-movie"
                onClick={() => nav('/')}
            >
                <p>X</p>
            </div>
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
