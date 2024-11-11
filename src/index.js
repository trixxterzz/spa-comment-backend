const express = require('express');
const { json, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const errorHandler = require('./middlewares/error');
const HttpError = require('./helpers/error');
const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:5173', 'https://frontend-summer-voice-777.fly.dev'],
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

const establishSocketConnection = require('./services/socket');

const PORT = 3000;

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true}));

app.use(router);
app.use(() => {
    throw new HttpError('Page not found', 404);
});
app.use(errorHandler);


const server = establishSocketConnection(app);

server.listen(PORT, () => console.log(`API Server started at ${PORT} port`));