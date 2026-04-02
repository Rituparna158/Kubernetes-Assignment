import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startWorker } from './worker';

const PORT = Number(process.env.PORT) || 3001;

startWorker();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Worker metrics is running on port ${PORT}`);
});
