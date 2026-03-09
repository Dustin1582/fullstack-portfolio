
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/MovieContext';
import '../css/MovieCard.css'

const MovieCard = ({results, isSearch = false, splitSection, isSeeAll = false}) => {
    const {BASE_IMAGE_URL, movieId} = useApp();
    const nav = useNavigate();
    if(!Array.isArray(results) || results.length === 0 || results === null) return;


    const handleCardClick = (id) => {
        movieId.current = id
        nav('/movie/moviehub/desc');
    }

    return (
        <>
            {!isSearch && results.map(movie => {
                
                const posterURL = `${BASE_IMAGE_URL}/w185${movie.poster_path}`;
                const year = movie.release_date.split("-")[0];
                return (
                    <div className={`${isSeeAll ? "see-all-outter-card" :"card-outside-border"}`} key={movie.id}
                        onClick={() => handleCardClick(movie.id)}
                    >
                        <div 
                            key={movie.id}
                            style={{backgroundImage: `${movie.poster_path === null ? "gray" : `url(${posterURL})`}`}}
                            className={`${isSeeAll ?  "see-all-inner-card" : "card-inside"}`}
                        >
                            <div className={`${isSeeAll ? "see-all-rating-box" : "rating-container"}`}>
                                <img src={`${import.meta.env.BASE_URL}/moviedb/star-pointed.svg`} alt={movie.vote_average} />
                                {isSeeAll && (
                                    <p>{Number(movie.vote_average).toFixed(1)}</p>
                                )}
                                {!isSeeAll && (
                                    <h4>{Number(movie.vote_average).toFixed(1)}</h4>
                                )}
                            </div>
                            {!isSeeAll && (
                                <div className="movie-title-container">
                                    <h6 className="movie-title">{movie.original_title}</h6>
                                </div>

                            )}
                            {isSeeAll && (
                                <div className="movie-title">
                                    <p>{movie.title}</p>
                                </div>
                            )}
                        </div>

                        {!isSeeAll && (
                            <div className="bottom-movie">
                                    <p>{year}</p>
                            </div>
                        )}
                    </div>

                )
            })}
            {isSearch && splitSection.map((section, idx) => {
                
                return (
                    <div className={`search-${section}`} key={`section-${idx}`}>
                        {section.map((data, idx) =>  {
                            const posterURL = `${BASE_IMAGE_URL}/w185${data.poster_path}`; 
                            const year = data.release_date.split("-")[0]

                            return (
                                <div className={`search-card-border section-${idx}`} key={data.id}>
                                    <div 
                                        key={data.id}
                                        style={{backgroundImage: `url(${posterURL})`}}
                                        className='search-card-inside'
                                    >
                                        <div className="search-rating-container">
                                            <img src={`${import.meta.env.BASE_URL}/moviedb/star-pointed.svg`} alt={data.vote_average} />
                                            <h4>{Number(data.vote_average).toFixed(1)}</h4>
                                        </div>
                                        <div className="movie-search-title-container">
                                            <h6 className='movie-title'>{data.original_title}</h6>
                                        </div>
                                    </div>
                                    <div className="search-footer">
                                            <p>{year}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                )
            })}
            

        </>
    )
}

export default MovieCard
