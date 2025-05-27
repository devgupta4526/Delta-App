import dotenv from 'dotenv';
import colors from 'colors';
import app from './app.js'
import { Server } from 'socket.io';
import connectDB from './db/db.js';
import http from 'http';



dotenv.config({
    path: './.env',
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});


connectDB().then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`.green.bold.underline);
    });
}).catch(() => {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
}
);


