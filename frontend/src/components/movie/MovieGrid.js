import React from 'react';
import styled from 'styled-components';
import MovieCard from './MovieCard';
import LoadingCard from './LoadingCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  max-width: 400px;
`;

const ErrorState = styled(EmptyState)`
  color: ${({ theme }) => theme.colors.rating.star};
`;

const MovieGrid = ({ 
  movies = [], 
  loading = false, 
  error = null,
  emptyMessage = "Nenhum filme encontrado",
  emptyDescription = "Tente buscar por outros termos ou navegue pelas categorias",
  loadingCount = 12
}) => {
  
  if (error) {
    return (
      <ErrorState>
        <EmptyIcon>⚠️</EmptyIcon>
        <EmptyTitle>Erro ao carregar filmes</EmptyTitle>
        <EmptyDescription>{error}</EmptyDescription>
      </ErrorState>
    );
  }

  if (loading) {
    return (
      <GridContainer>
        {Array.from({ length: loadingCount }, (_, index) => (
          <LoadingCard key={index} />
        ))}
      </GridContainer>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>🎬</EmptyIcon>
        <EmptyTitle>{emptyMessage}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {movies.map((movie, index) => (
        <MovieCard 
          key={movie.imdbId || `${movie.title}-${index}`} 
          movie={movie} 
        />
      ))}
    </GridContainer>
  );
};

export default MovieGrid; 