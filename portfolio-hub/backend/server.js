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
app.use(express.json());
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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

mongoose.connection.on('connected', () => {
  console.log('Mongo connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongo disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongo connection error:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('Connected to MongoDb');

    // Sync indexes safely (won’t crash the process if it fails)
    try {
      await Inventory.syncIndexes();
      console.log('Inventory indexes synced');
    } catch (indexError) {
      console.error('Inventory syncIndexes failed:', indexError);
    }

    app.listen(PORT, () => {
      console.log(`server is listening on Port: ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    // ✅ CHANGED: exit so Render restarts, but with a clear reason
    process.exit(1);
  }
}

startServer();