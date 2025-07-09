import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import movieService from '../services/movieService';
import MovieGrid from '../components/movie/MovieGrid';

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const movies = await movieService.getPopularMovies();
      setPopularMovies(movies);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar filmes populares:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeContainer> 
        <MovieGrid
          movies={popularMovies}
          loading={loading}
          error={error}
          emptyMessage="Nenhum filme popular encontrado"
          emptyDescription="Não foi possível carregar os filmes populares no momento"
          loadingCount={8}
        />
    </HomeContainer>
  );
};

export default HomePage; 