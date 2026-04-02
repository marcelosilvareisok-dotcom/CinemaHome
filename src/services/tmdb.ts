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
  media_type: "movie",
  videos: {
    results: [
      {
        type: "Trailer",
        key: "L3oOldViIgY", // Placeholder YouTube video key
        site: "YouTube"
      }
    ]
  },
  genres: [{ id: 1, name: "Ação" }, { id: 2, name: "Ficção Científica" }],
  vote_average: 8.5,
  release_date: "2026-01-01"
};

const mockResponse = {
  data: {
    results: Array(100).fill(mockMovie).map((m, i) => ({ ...m, id: i + 1 }))
  }
};

const mockDetailsResponse = {
  data: mockMovie
};

const withFallback = async (requestFn: () => Promise<any>, isDetails = false) => {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'undefined') {
    console.warn("TMDB API Key ausente. Usando dados de demonstração.");
    return isDetails ? mockDetailsResponse : mockResponse;
  }
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.warn("TMDB API Key inválida (401). Usando dados de demonstração.");
      return isDetails ? mockDetailsResponse : mockResponse;
    }
    throw error;
  }
};

// Helper para buscar 100 resultados (5 páginas de 20)
const fetch100 = async (endpoint: string) => {
  return withFallback(async () => {
    const promises = [];
    for (let i = 1; i <= 5; i++) {
      const separator = endpoint.includes('?') ? '&' : '?';
      promises.push(tmdbApi.get(`${endpoint}${separator}page=${i}`));
    }
    const responses = await Promise.all(promises);
    const allResults = responses.flatMap(res => res.data.results);
    
    // Remove duplicatas baseadas no ID para evitar erros de chaves no React
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
    
    return { data: { results: uniqueResults } };
  });
};

export const getTrending = () => fetch100('/trending/all/week');
export const getNetflixOriginals = () => fetch100('/discover/tv?with_networks=213');
export const getTopRated = () => fetch100('/movie/top_rated');
export const getActionMovies = () => fetch100('/discover/movie?with_genres=28');
export const getComedyMovies = () => fetch100('/discover/movie?with_genres=35');
export const getHorrorMovies = () => fetch100('/discover/movie?with_genres=27');
export const getRomanceMovies = () => fetch100('/discover/movie?with_genres=10749');
export const getDocumentaries = () => fetch100('/discover/movie?with_genres=99');
export const getPopularMovies = () => fetch100('/movie/popular');
export const getPopularSeries = () => fetch100('/tv/popular');

export const getActionSeries = () => fetch100('/discover/tv?with_genres=10759');
export const getComedySeries = () => fetch100('/discover/tv?with_genres=35');
export const getDramaSeries = () => fetch100('/discover/tv?with_genres=18');
export const getSciFiSeries = () => fetch100('/discover/tv?with_genres=10765');

export const getMovieDetails = (id: string, type: 'movie' | 'tv' = 'movie') => 
  withFallback(() => tmdbApi.get(`/${type}/${id}?append_to_response=videos,credits`), true);

export const searchContent = (query: string) => 
  withFallback(() => tmdbApi.get(`/search/multi?query=${encodeURIComponent(query)}`));

export default tmdbApi;
