import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startWorker } from './worker';

const PORT = process.env.PORT || 3001;

startWorker();

app.listen(PORT, () => {
  console.log(`Worker metrics is running on port ${PORT}`);
});
