import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
  },
});

// Mock data fallback for when API key is missing or invalid
const mockMovie = {
  id: 1,
  title: "CINEMAHOME Original",
  name: "CINEMAHOME Series",
  poster_path: "/xJWPZIYOEFIjZpQ7sBJTFi5lsPT.jpg", // Example TMDB paths
  backdrop_path: "/xJWPZIYOEFIjZpQ7sBJTFi5lsPT.jpg",
  overview: "Bem-vindo ao CINEMAHOME. Adicione sua chave da API do TMDB (VITE_TMDB_API_KEY) nos Secrets para ver filmes reais. Este é um conteúdo de demonstração.",
  media_type: "movie"
};

const mockResponse = {
  data: {
    results: Array(10).fill(mockMovie).map((m, i) => ({ ...m, id: i }))
  }
};

const withFallback = async (requestFn: () => Promise<any>) => {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'undefined') {
    console.warn("TMDB API Key ausente. Usando dados de demonstração.");
    return mockResponse;
  }
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.warn("TMDB API Key inválida (401). Usando dados de demonstração.");
      return mockResponse;
    }
    throw error;
  }
};

export const getTrending = () => withFallback(() => tmdbApi.get('/trending/all/week'));
export const getNetflixOriginals = () => withFallback(() => tmdbApi.get('/discover/tv?with_networks=213'));
export const getTopRated = () => withFallback(() => tmdbApi.get('/movie/top_rated'));
export const getActionMovies = () => withFallback(() => tmdbApi.get('/discover/movie?with_genres=28'));
export const getComedyMovies = () => withFallback(() => tmdbApi.get('/discover/movie?with_genres=35'));
export const getHorrorMovies = () => withFallback(() => tmdbApi.get('/discover/movie?with_genres=27'));
export const getRomanceMovies = () => withFallback(() => tmdbApi.get('/discover/movie?with_genres=10749'));
export const getDocumentaries = () => withFallback(() => tmdbApi.get('/discover/movie?with_genres=99'));

export const getMovieDetails = (id: string, type: 'movie' | 'tv' = 'movie') => 
  withFallback(() => tmdbApi.get(`/${type}/${id}?append_to_response=videos,credits`));

export const searchContent = (query: string) => 
  withFallback(() => tmdbApi.get(`/search/multi?query=${encodeURIComponent(query)}`));

export default tmdbApi;
