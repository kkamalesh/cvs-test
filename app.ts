import express from 'express';
import { MovieService } from './services/movieService';

const app = express();
const movieService = new MovieService();

app.get('/movies/:year', async (req, res) => {
  try {
    const { year } = req.params;
    
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: 'Invalid year format. Use YYYY.' });
    }

    const movies = await movieService.getMoviesByYear(year);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { app };