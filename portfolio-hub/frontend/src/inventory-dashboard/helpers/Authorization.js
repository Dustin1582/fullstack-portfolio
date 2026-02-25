let refreshPromise = null;

const getNewAccessToken = async (URL) => {
    try {
          const res = await fetch(`${URL}/refresh`, {
          method: 'GET',
          credentials: "include"
        });

        const json = await res.json().catch(() => null);
        
        if(!res.ok || !json.accessToken) {
            throw new Error("Refresh Failed")
        }

        return json.accessToken;

    } catch (error) {
        console.error("getNewAccessToken Error: ", error.message)
        return null;
    }
}


const fetchWithAuth = async ({URL, accessToken, setAccessToken, endpoint, options = {} }) => {
    //try with current accessCode
    let res = await fetch(`${URL}/${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include"
    });

    // if its expired check
    if(res.status === 401 || res.status === 403) {
        if(!refreshPromise) {
            refreshPromise = getNewAccessToken(URL)
            .then((newToken) => {
                setAccessToken(newToken);
                return newToken
            })
            .finally(() => {
                refreshPromise = null
            });
        }

        const newToken = await refreshPromise

        res = await fetch(`${URL}/${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
        });
    }

    return res
}

export default fetchWithAuth;


