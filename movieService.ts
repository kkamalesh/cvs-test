import axios from 'axios';
import { Movie } from '../src/types';
import { config } from '../src/config';
  
  export class MovieService {
    private headers = {
      Authorization: `Bearer ${config.apiKey}`
    };
  
    async getMoviesByYear(year: string): Promise<Movie[]> {
      try {
        const moviesResponse = await axios.get(
          `${config.baseUrl}/discover/movie`,
          {
            headers: this.headers,
            params: {
              language: 'en-US',
              page: 1,
              primary_release_year: year,
              sort_by: 'popularity.desc'
            }
          }
        );
  
        const movies = moviesResponse.data.results;
        const enrichedMovies = await Promise.all(
          movies.map(async (movie: any) => {
            const editors = await this.getMovieEditors(movie.id).catch(() => []);
            return {
              title: movie.title,
              release_date: new Date(movie.release_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }),
              vote_average: movie.vote_average,
              editors
            };
          })
        );
  
        return enrichedMovies;
      } catch (error) {
        throw new Error('Failed to fetch movies');
      }
    }
  
    private async getMovieEditors(movieId: number): Promise<string[]> {
      try {
        const creditsResponse = await axios.get(
          `${config.baseUrl}/movie/${movieId}/credits`,
          { headers: this.headers }
        );
  
        return creditsResponse.data.crew
          .filter((person: any) => person.known_for_department === 'Editing')
          .map((editor: any) => editor.name);
      } catch (error) {
        return [];
      }
    }
  }