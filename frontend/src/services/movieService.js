import api from './api';

export const movieService = {
  /**
   * Busca filmes (POST)
   * @param {Object} searchParams - Parâmetros de busca
   * @param {string} searchParams.query - Termo de busca
   * @param {number} [searchParams.page=1] - Página
   * @param {string} [searchParams.type] - Tipo (movie, series, episode)
   * @param {number} [searchParams.year] - Ano
   * @returns {Promise} Promise com resultado da busca
   */
  async searchMovies(searchParams) {
    try {
      const response = await api.post('/movies/search', searchParams);
      return response.data;
    } catch (error) {
      throw new Error(
        (error.response && error.response.data && error.response.data.message) || 'Erro ao buscar filmes'
      );
    }
  },

  /**
   * Busca filmes (GET) - versão simplificada
   * @param {string} query - Termo de busca
   * @param {number} [page=1] - Página
   * @param {string} [type] - Tipo (movie, series, episode)
   * @param {number} [year] - Ano
   * @returns {Promise} Promise com resultado da busca
   */
  async searchMoviesSimple(query, page = 1, type = null, year = null) {
    try {
      const params = { q: query, page };
      if (type) params.type = type;
      if (year) params.year = year;

      const response = await api.get('/movies/search', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        (error.response && error.response.data && error.response.data.message) || 'Erro ao buscar filmes'
      );
    }
  },

  /**
   * Busca detalhes de um filme por IMDB ID
   * @param {string} imdbId - ID do filme no IMDB
   * @returns {Promise} Promise com detalhes do filme
   */
  async getMovieDetails(imdbId) {
    try {
      const response = await api.get(`/movies/${imdbId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Filme não encontrado');
      }
      throw new Error(
        (error.response && error.response.data && error.response.data.message) || 'Erro ao buscar detalhes do filme'
      );
    }
  },

  /**
   * Busca filme por título
   * @param {string} title - Título do filme
   * @param {number} [year] - Ano (opcional)
   * @returns {Promise} Promise com detalhes do filme
   */
  async getMovieByTitle(title, year = null) {
    try {
      const params = year ? { year } : {};
      const response = await api.get(`/movies/title/${encodeURIComponent(title)}`, { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Filme não encontrado');
      }
      throw new Error(
        (error.response && error.response.data && error.response.data.message) || 'Erro ao buscar filme'
      );
    }
  },

  /**
   * Busca filmes populares
   * @returns {Promise} Promise com lista de filmes populares
   */
  async getPopularMovies() {
    try {
      const response = await api.get('/movies/popular');
      return response.data;
    } catch (error) {
      throw new Error(
        (error.response && error.response.data && error.response.data.message) || 'Erro ao buscar filmes populares'
      );
    }
  },

  /**
   * Verifica a saúde do serviço
   * @returns {Promise} Promise com status do serviço
   */
  async healthCheck() {
    try {
      const response = await api.get('/movies/health');
      return response.data;
    } catch (error) {
      throw new Error('Serviço indisponível');
    }
  }
};

export default movieService; 