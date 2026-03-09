import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../helper/fetchApi';
import { useApp } from '../context/MovieContext';
import { getPraginationItems } from '../helper/praginationButtons';
import { useFilter } from '../context/FilterContext';
import MovieCard from '../components/MovieCard';
import '../css/SeeAllPage.css'

const SeeAllMovies = ({endPoint, isFiltered}) => {
  const nav = useNavigate();
  const {filters} = useFilter();
  
  const {buildURL, BASE_URL, API_KEY, BASE_IMAGE_URL} = useApp();
  const [page, setPage] = useState(1)
  const [pageTotal, setPageTotal] = useState(0)
  const [topMovies, setTopMovies] = useState([]);
  const [middleMovies, setMiddleMovies] = useState([]);
  const [bottomMovies, setBottomMovies] = useState([]);

  const apiPageCache = useRef(new Map())
  const totalResults = useRef(null);
  const requestId = useRef(0);

  const fetchApiPage = async (apiPageNumber) => {
    let url = buildURL(BASE_URL, endPoint, apiPageNumber);
    
    if(isFiltered){
      if(filters) {
        filters.map(type => {
          url = buildURL(BASE_URL, endPoint, apiPageNumber, "en-US" ,type.id, type.date, Number(type.rating));
        })

      }
    }

    const data = await fetchApi(url, API_KEY);
    return data;
  }

  async function ensureApiPagesLoaded(apiPagesNeeded) {
    for (let i = 0; i < apiPagesNeeded.length; i += 1) {
      const apiPage = apiPagesNeeded[i];

      if (apiPageCache.current.has(apiPage)) {
        continue;
      }

      const data = await fetchApiPage(apiPage);
      if (data && Array.isArray(data.results)) {
        const cleanedData = (data?.results ?? []).filter((r) => {
          return Boolean(r.poster_path) && Boolean(r.release_date);
        })
        apiPageCache.current.set(apiPage, cleanedData);

        // Save total_results once
        if (typeof data.total_results === "number" && totalResults.current === null) {
          totalResults.current = data.total_results;
        }
      }
    }
  }

  function buildUiPageFromApiCache(uiPage, uiPageSize) {
    const startIndex = (uiPage - 1) * uiPageSize;
    const endIndex = startIndex + uiPageSize;

    const apiPageSize = 20;

    const apiPageA = Math.floor(startIndex / apiPageSize) + 1;
    const apiPageB = Math.floor((endIndex - 1) / apiPageSize) + 1;

    const a = apiPageCache.current.get(apiPageA) ?? [];
    const b = apiPageCache.current.get(apiPageB) ?? [];

    // Combine the needed pages (if same page, don't duplicate)
    const combined = apiPageA === apiPageB ? a : [...a, ...b];

    // Offset inside the combined list
    const offsetInA = startIndex % apiPageSize;

    return combined.slice(offsetInA, offsetInA + uiPageSize);
  }
  

  useEffect(() => {
    requestId.current += 1;
    const thisRequest = requestId.current;

    async function load() {
      const apiPageSize = 20;
      const uiPageSize = 15;

      const startIndex = (page - 1) * uiPageSize;
      const endIndex = startIndex + uiPageSize;

      const apiPageA = Math.floor(startIndex / apiPageSize) + 1;
      const apiPageB = Math.floor((endIndex - 1) / apiPageSize) + 1;

      await ensureApiPagesLoaded(
        apiPageA === apiPageB ? [apiPageA] : [apiPageA, apiPageB]
      );

      if (thisRequest !== requestId.current) return;

      const pageMovies = buildUiPageFromApiCache(page, uiPageSize);

      // Split into your 3 rows
      setTopMovies(pageMovies.slice(0, 5));
      setMiddleMovies(pageMovies.slice(5, 10));
      setBottomMovies(pageMovies.slice(10));

      if (typeof totalResults.current === "number") {
        setPageTotal(Math.ceil(totalResults.current / uiPageSize));
      }
    }

    load();
  }, [page, filters]);

  
  const items = getPraginationItems(page, pageTotal);
  
  return (
    <div className='main-page-outside'>
        <div className="main-page" style={{backgroundImage: `url(${import.meta.env.BASE_URL}moviedb/movie_background.png)`}}>
            <div className="back-button-movie"
              onClick={() => nav('/movie/moviehub')}
            >
              <p>X</p>
            </div>
            <div className="see-all-header-container">
              <div className="see-all-header">
                <h2 className='first-child'>Wondering Whats</h2>
                <h2 className='last-child'>Playing Now?</h2>
              </div>
              <div className="see-all-quote">
                <p>Search thousands of movies from TMDb</p>
              </div>
            </div>
            <div className="see-all-body">
              <div className="see-all-top row">
                {Array.isArray(topMovies) && topMovies.length !== 0 && (
                  <MovieCard results={topMovies} isSeeAll={true}/>

                )}
              </div>
              <div className="see-all-middle row">
                {Array.isArray(middleMovies) && middleMovies.length !== 0 && (
                  <MovieCard results={middleMovies} isSeeAll={true}/>
                )}
              </div>
              <div className="see-all-bottom row">
                {Array.isArray(bottomMovies) && bottomMovies.length !== 0 && (
                  <MovieCard results={bottomMovies} isSeeAll={true}/>
                )}
              </div>
            </div>

            <div className="see-all-footer">
              {Array.isArray(items) && items.length !== 0 && items.map((item, idx) => {
                if(item === "..."){
                  return <span key={`dots-${idx}`} className='dots'>...</span>
                }

                
                return(
                  <div key={`item-${idx}`} className={`see-all-btn ${item === page ? "active-red" : ""}`} 
                    onClick={() => setPage(item)}
                  >
                    <p>{item}</p>
                  </div>
                )
              })}
            </div>
        </div>
    </div>
  )
}

export default SeeAllMovies


// const poster_path = `${BASE_IMAGE_URL}/w185/${movie.poster_path}`
//                   return (
//                     <div 
//                       key={movie.id}
//                       className='see-all-outter-card' 
//                       style={{backgroundImage: `url(${poster_path})`}}
//                     >
//                       <div className="see-all-inner-card">
//                         <div className="see-all-rating-box">
//                           <img src={`${import.meta.env.BASE_URL}/moviedb/star-pointed.svg`} alt={`rating ${movie.vote_average}`} />
//                           <p>{movie.vote_average.toFixed(1)}</p>
//                         </div>
//                         <div className="movie-title">
//                           <p>{movie.title}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )