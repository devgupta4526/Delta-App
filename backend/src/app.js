import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();


//Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // <-- replace with your frontend origin
  credentials: true,
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '16kb'}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());



import userRouter from './routes/users.routes.js';
import poolRouter from './routes/pool.routes.js';
import chatRouter from './routes/chat.routes.js';
import reviewRouter from "./routes/review.routes.js";
import postRouter from './routes/post.routes.js';
import qrRouter from './routes/qr.routes.js';
import fs from 'fs';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const tempDir = './public/temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pool",poolRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/qr",qrRouter);


export default app;


