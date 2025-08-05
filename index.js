require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/conn');
const http = require('http');
const { Server } = require('socket.io');
//const startCronJobs = require('./utils/cronjobs');

// Routers
const userRouter = require('./router/user-router');
//const postsRouter = require('./router/posts-router');
//const storyRouter = require('./router/stories-router');
//const notificationRouter = require('./router/notification-router');

const app = express();
const server = http.createServer(app);

// CORS setup
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://localhost:5173',
        'https://snappy1357.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- SOCKET.IO Setup ---
const io = new Server(server, {
    cors: corsOptions
});




// Make io + connectedUsers accessible in controllers
app.set('io', io);
//app.set('connectedUsers', connectedUsers);

// API Routes
//app.use('/api/post', postsRouter);
app.use('/api/user', userRouter);
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`)
})
//app.use('/api/story', storyRouter);
//app.use('/api/notifications', notificationRouter);

// Run cron jobs only if not testing


// Export app for testing
module.exports = app;