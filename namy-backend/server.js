import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import { resourceRouter } from './routes/resource.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workshops', resourceRouter('workshops'));
app.use('/api/news', resourceRouter('news'));
app.use('/api/stats', resourceRouter('stats'));
app.use('/api/seminars', resourceRouter('seminars'));
app.use('/api/leadership', resourceRouter('leadership'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`NAMY backend running at http://localhost:${PORT}`);
});
