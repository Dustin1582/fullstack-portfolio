const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const registerRoute = require('./routes/registerRoute');
const authRoute = require('./routes/authRoute');
const refreshRoute = require('./routes/refreshRoute')
const inventoryRoute = require('./routes/inventoryRoute');
const currentUserRoute = require('./routes/getCurrentUserRoute');
const userRoute = require('./routes/userRoute');
const logoutRoute = require('./routes/logoutRoute');
const issueRoute = require('./routes/issueRoute');

const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require('./config/corsOptions');

const Inventory = require('./models/inventory');

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5500;
app.use(logger)
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
// middleware to parse the json
app.use(express.json());
app.use(cookieParser())
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDb');
    await Inventory.syncIndexes();
    console.log('Inventory indexes synced');
});

//Testing the route
app.get('/', (req, res) => {
    res.json({message: 'server and db connected'})
});


//routes
app.use('/', registerRoute);
app.use('/', authRoute);
app.use('/', refreshRoute);
app.use(verifyJWT);
app.use('/',  inventoryRoute)
app.use('/', currentUserRoute)
app.use('/', userRoute)
app.use('/', logoutRoute)
app.use('/', issueRoute)

app.get('/protected', (req, res) => {
    res.json({
        message: 'You accessed a protected route',
        userId: req.userId,
        username: req.username
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is listening on Port: ${PORT}`)
});
