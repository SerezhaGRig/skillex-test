import express, { Express } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewars/error';
import { generateRouter } from './controllers/generate';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.use('/generate', generateRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
