import express from 'express';
import connectDB from './config/db.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieparser from 'cookie-parser';

import { userRouter } from './routes/userRoute.js';
import { authRouter } from './routes/authRoute.js';

import routeValidator from './middlewares/routesHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import authenticate from './middlewares/authenticate.js';
import { appMode } from './config/appMode.js';

const app = express();
const port = 5000;

await connectDB();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());

app.use(cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:3000"],
    credentials: true
}));
app.disable('x-powered-by');
app.set('trust proxy', () => {
	return appMode === "production" ? 1 : 0;
})

//routes
app.get('/', 
	(req, res) => res.status(200).json({success: true, message: "A Hello from Me to You"}));
app.get('/healthz', (req, res) => res.status(200).json({success: true, message: "A healthy server"}));
app.get('/api/', 
	(req, res) => res.status(200).json({success: true, message: "Hello To You"}));
app.use('/api/users/', authenticate, userRouter);
app.use('/api/auth/', authRouter);

app.use(routeValidator);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})

