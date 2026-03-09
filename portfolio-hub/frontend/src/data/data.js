export const projects = [
    {
        name: "Inventory Manager", 
        icon: `${import.meta.env.BASE_URL}/In.ico`, 
        createdWith: [
            {name: "React", color: "#aee8fca6", darkColor: "#0B3D59"},
            {name: "Express", color: "#ffe08aad", darkColor: "#4A2F00"}, 
            {name: "MongoDB", color: "#b7e8c3a6", darkColor: "#0F3D2E"}
        ],
        desc: "Track and manage products" ,
        link: "inventory/login"
    },
    {
        name: "Movie Database",
        icon: `${import.meta.env.BASE_URL}/moviedb/popcorn.svg`,
        createdWith: [
            {name: "React", color: "#aee8fca6", darkColor: "#0B3D59"}
        ],
        desc: "Search your favorite movies",
        link: "movie/moviehub"
    },
]