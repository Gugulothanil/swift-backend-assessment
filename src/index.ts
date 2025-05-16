
// src/index.ts (update this file to include comment routes)
import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './utils/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {

    console.log(`\uD83D\uDE80 Server running on http://localhost:${PORT}`);
  });
});