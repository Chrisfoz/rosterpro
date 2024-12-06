import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as authRouter } from './routes/auth';
import { router as usersRouter } from './routes/users';
import { router as servicesRouter } from './routes/services';
import { router as rostersRouter } from './routes/rosters';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/rosters', rostersRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
