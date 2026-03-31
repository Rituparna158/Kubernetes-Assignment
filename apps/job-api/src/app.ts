import express from 'express';
import jobRoutes from './routes/job.routes';


const app = express();

app.use(express.json());

app.use("/api",jobRoutes);

export default app;