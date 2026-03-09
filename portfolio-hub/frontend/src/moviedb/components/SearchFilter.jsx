import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/MovieContext'
import { useFilter } from '../context/FilterContext'
import { useNavigate } from "react-router-dom";
import '../css/SearchFilter.css'

const SearchFilter = () => {
    const { 
        setGenres, 
        genres, setChosenGenre, chosenGenre, yearRange,  ratingScore,
        setYearRange, setRatingScore, setFilters
    } = useFilter();

    const nav = useNavigate();

    const today = new Date();
    const year = today.getFullYear();

    const {BASE_URL, buildURL, API_KEY} = useApp();
    

    const [active, setActive] = useState(0)
    

    const ranOnce = useRef(false);
    
    useEffect(() => {
        if(ranOnce.current) return
        ranOnce.current = true
        const load = async () => {
            try {
                const res = await fetch(buildURL(BASE_URL, '/genre/movie/list'), {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type" : "application/json"
                    }
                });

                const json = await res.json().catch(() => null);

                if(!res.ok) {
                    console.error("Error fetching genre list: ", json);
                    return
                }
                setGenres(json);
                
            } catch (error) {
                console.error("Error fetching list: ", error.message);
                return;
            }
        }

        load();

        return () => {
            ranOnce.current = false
        }

    }, [])

    const handleFilterClick = () => {
  
        let genreId = [];
        if(chosenGenre.length !== 0) {
            genreId = chosenGenre.map(genre => {
                return genre.id;
            });
        
        }
        
        const newFilter = [{
            id:genreId,
            date: yearRange,
            rating: ratingScore
        }]
        
        setFilters(newFilter);
        nav('filtered-movies');
        setChosenGenre([]);
        setYearRange(year);
        setRatingScore(0);
    }

    if(!genres) return
    const genreArray = genres.genres

    return (
        <div className='search-filter-outter-border'>
        <div className="search-header">
            <h3>Search Filters</h3>
        </div>
        <div className="search-genre">
            <div className="search-genre-inner">
                <h3>Genre</h3>
                {Array.isArray(genreArray) && genreArray.length !== 0 && genreArray.map(genre => {
                    const isChecked = chosenGenre.some(item => {
                        return item.id === genre.id
                    })
                    return (
                        <div
                            key={genre.name} 
                            className="genre-ctr"
                        >
                            <label className={`cb`}>
                                <span className={`cb-box ${isChecked ? "red" : ""}`} aria-hidden="true"
                                    onClick={() => {
                                        setChosenGenre((prev) => {

                                            const alreadyChosen = prev.some(item => {
                                                return item.id === genre.id
                                            });

                                            if(alreadyChosen) {
                                                return prev.filter(item => item.id !== genre.id);
                                            } 

                                            return [...prev, {name: genre.name, id: genre.id}];
                                        })
                                    }}
                                >
                                    <img 
                                        src={`${import.meta.env.BASE_URL}/moviedb/checkmark.svg`}
                                        alt="" 
                                        className={`${isChecked ? "checkmark" : "no-checkmark"}`}
                                        />
                                </span>
                                <span className='cb-text'>{genre.name}</span>
                            </label>

                        </div>

                    )
                })}
            </div>
            <div className="movie-range">
                <label htmlFor="year-range">Released</label>
                <input type="range" 
                    name="" 
                    id="year-range" 
                    min={1920} 
                    max={year} 
                    value={yearRange}
                    style={{ "--fill" : "100%"}}
                    onChange={(e) => setYearRange(e.target.value)}/>

                <div className="bottom-year-labels">
                    <label htmlFor="year-range">1920</label>
                    <label htmlFor="year-range">{yearRange}</label>
                </div>
            </div>

            <div className="rating-options">
                <h4>Rating</h4>
                <div className="inner-rating-options">
                    {Array.from({length: 8 - 7 + 1}).map((_, i) => {
                        const value = (9 - i).toString();

                        return (
                            <div className={`rating-option-button ${active === value ? "active-rating" : ""}`}
                                onClick={() => {
                                    setActive(value);
                                    setRatingScore(value);
                                }}
                            >
                                <img src={`${import.meta.env.BASE_URL}/moviedb/star-pointed.svg`} />
                                <h6>{`${value} +`}</h6>
                            </div>
                        )
                    })}

                    <div className={`rating-option-button ${active === 0 ? "active-rating" : ""}`}
                                onClick={() => {
                                    setActive(0);
                                    setRatingScore(0);
                                }}
                            >
                                <img src={`${import.meta.env.BASE_URL}/moviedb/star-pointed.svg`} />
                                <h6>All</h6>
                            </div>
                    
                </div>
            </div>

            <div className="submit-filter-container">
                <div className="submit-filter-button"
                    onClick={() => handleFilterClick()}
                >
                    <p>Apply Filters</p>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SearchFilter
