const whitelist = ['http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        //for tools like thunder
        if(!origin) {
            callback(null, true)
            return
        }
        
        //allowing front end
        if(whitelist.includes(origin)) {
            callback(null, origin)
            return
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionSuccessStatus: 200,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', "Authorization"]
}

module.exports = corsOptions