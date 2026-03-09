export const fetchApi = async (builtUrl, API_KEY) => {
    if(typeof builtUrl !== "string") {
        console.error("built url must be included");
        return;
    }
    
    try {
        const res = await fetch(`${builtUrl}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type" : "application/json"
            }
        })
        
        const data = await res.json().catch(() => null);

        if(!res.ok) {
            console.error("issue with fetch: ", data);
            return null;
        }

        return data
        
    } catch (error) {
        console.error("Server Error: ", error.message);
        return null;
    }

}