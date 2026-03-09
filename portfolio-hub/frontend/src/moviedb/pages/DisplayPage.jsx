import { useEffect, useState } from "react"
import { useApp } from "../context/MovieContext"
import { useLocation, useNavigate } from "react-router-dom";
import '../css/DisplayPage.css'
const DisplayPage = () => {
  const nav = useNavigate();
  const {movieId, BASE_URL, API_KEY, BASE_IMAGE_URL} = useApp();
  const location = useLocation();
  const [movieData, setMovieData] = useState({});
  let posterUrl = "";
  let name = "";
  let runtime = "";
  let release_date = "";
  useEffect(() => {
    if(location.pathname !== '/movie/moviehub/desc') return;

    const load = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${movieId.current}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json().catch(() => null);

        if(!res.ok) {
          console.error("Fetch Display Error: ", data);
          return;
        }

        setMovieData(data);

      } catch (error) {
        console.error("Error fetching description: ", error.message);
        return;
      }
    }

    load();
    
  }, [movieId, location.pathname])

  if(movieData) {
    const genres = movieData.genres;
    const total_mins = Number(movieData.runtime);
    const hours = Math.floor(total_mins / 60);
    const mins = total_mins % 60
    const release = movieData.release_date;
    if(release !== "" && release != null) {
      const date = new Date(release);
      const date_formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric" 
      });
      release_date = date_formatter.format(date);
    }

    posterUrl = `${BASE_IMAGE_URL}/w500/${movieData.poster_path}`;
    name = Array.isArray(genres) && genres.length > 0 ? genres.map(genre => genre.name) : [];
    runtime = `${hours}h ${mins}m`;
  }

  return (
    <div className="main-page-outside">
      <div className="main-page selected-main-page"
        style={{backgroundImage: `url(${import.meta.env.BASE_URL}moviedb/movie_background.png)`}}
      >
        <div className="back-button-movie"
          onClick={() => nav('/movie/moviehub')}
        >
          <p>X</p>
        </div>
      <div className="backdrop">
        <div className="left-column">
          <div className="selected-movie-image">
            <div className="selected-movie-img">
              <img src={posterUrl} alt={`${movieData.original_title} image`} />
            </div>
            <div className="tagline">
              <p>{movieData.tagline}</p>
            </div>
          </div>

        </div>
        <div className="right-column">
          <div className="selected-movie-title">
            <h1>{movieData.original_title}</h1>
          </div>
          <div className="selected-r">
            <div className="selected-movie-rating">
              <img src={`${import.meta.env.BASE_URL}moviedb/gold-star.svg`}/>
              <h5>{Number(movieData.vote_average).toFixed(1)}</h5>
            </div>
            <div className="selected-genre">
              <h5>{name[0]}</h5>
            </div>
            <div className="selected-length">
              <h5>{runtime}</h5>
            </div>
          </div>
          <div className="selected-movie-release">
            <p>{release_date !== "" && release_date != null &&(release_date)}</p>
          </div>
          <div className="selected-movie-overview">
            <p>{movieData.overview}</p>
          </div>
          
        </div>

      </div>

      </div>
    </div>
  )
}



export default DisplayPage
