import { createContext, useContext, useMemo, useState } from "react";


const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {

    const today = new Date();
    const year = today.getFullYear();
    const [yearRange, setYearRange] = useState(year);
    const [filters, setFilters] = useState([]);
    const [genres, setGenres] = useState([]);
    const [chosenGenre, setChosenGenre] = useState([]);
    const [ratingScore, setRatingScore] = useState(0);

    const contextValue = useMemo(() => {
        return {
            filters, chosenGenre, ratingScore, genres, yearRange,
            setFilters, setChosenGenre, setRatingScore, setGenres, setYearRange,
            
        }
    }, [filters, chosenGenre, ratingScore, genres, yearRange]);

    return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>
}

export function useFilter() {
    const value = useContext(FilterContext);

    if(value == null) {
        throw new Error("UseFilter must be used inside of <FilterProvider>");
    }

    return value;
}

export default FilterContext;