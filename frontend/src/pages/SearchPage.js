import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import movieService from '../services/movieService';
import MovieGrid from '../components/movie/MovieGrid';
import { FiFilter, FiX } from 'react-icons/fi';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const SearchSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FiltersTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterSelect = styled.select`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.button.primary};
  }
`;

const FilterInput = styled.input`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.button.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const ResultsInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ResultsText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    year: searchParams.get('year') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== filters.query) {
      const newFilters = {
        query: query,
        type: searchParams.get('type') || '',
        year: searchParams.get('year') || '',
        page: parseInt(searchParams.get('page')) || 1
      };
      setFilters(newFilters);
      searchMovies(query);
    }
  }, [searchParams.get('q')]);

  useEffect(() => {
    if (allMovies.length > 0) {
      applyLocalFilters();
    }
  }, [filters.type, filters.year, allMovies]);

  const searchMovies = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const searchParams = {
        query: query,
        page: 1
      };

      const response = await movieService.searchMovies(searchParams);
      
      console.log('Search response:', response);
      
      if (response.Response === 'True' || response.success) {
        const movieResults = response.Search || response.search || [];
        setAllMovies(movieResults);
        setTotalResults(response.totalResultsAsInt || 0);
      } else {
        setAllMovies([]);
        setMovies([]);
        setTotalResults(0);
        setError(response.Error || response.error || 'Nenhum filme encontrado');
      }
    } catch (err) {
      setError(err.message);
      setAllMovies([]);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilters = () => {
    let filteredMovies = [...allMovies];

    if (filters.type) {
      filteredMovies = filteredMovies.filter(movie => 
        (movie.Type || movie.type || '').toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.year) {
      filteredMovies = filteredMovies.filter(movie => 
        (movie.Year || movie.year || '').toString().includes(filters.year)
      );
    }

    console.log('Filtros aplicados:', { type: filters.type, year: filters.year });
    console.log('Filmes filtrados:', filteredMovies.length, 'de', allMovies.length);

    setMovies(filteredMovies);
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.year) params.set('year', newFilters.year);
    
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { 
      ...filters, 
      [key]: value
    };
    setFilters(newFilters);
    
    if (key !== 'page') {
      updateSearchParams(newFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      query: filters.query,
      type: '',
      year: ''
    };
    setFilters(clearedFilters);
    updateSearchParams(clearedFilters);
  };

  const getResultsText = () => {
    if (loading) return 'Carregando resultados...';
    if (error) return `Erro: ${error}`;
    
    const filteredCount = movies.length;
    const totalCount = allMovies.length;
    
    if (filters.type || filters.year) {
      return `Mostrando ${filteredCount} de ${totalCount} resultados para "${filters.query}"`;
    }
    
    return `${totalCount} resultados encontrados para "${filters.query}"`;
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>
          {filters.query ? `Resultados para "${filters.query}"` : 'Buscar Filmes'}
        </SearchTitle>
        {filters.query && (
          <SearchSubtitle>
            {loading ? 'Buscando...' : `${totalResults} resultados encontrados`}
          </SearchSubtitle>
        )}
      </SearchHeader>

      <FiltersContainer>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter />
            Filtros
          </FiltersTitle>
          <ClearFiltersButton onClick={handleClearFilters}>
            <FiX size={16} />
            Limpar Filtros
          </ClearFiltersButton>
        </FiltersHeader>

        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Tipo</FilterLabel>
            <FilterSelect
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="movie">Filmes</option>
              <option value="series">Séries</option>
              <option value="episode">Episódios</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Ano</FilterLabel>
            <FilterInput
              type="number"
              placeholder="Ex: 2023"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      {filters.query && (
        <>
          <ResultsInfo>
            <ResultsText>
              {getResultsText()}
            </ResultsText>
          </ResultsInfo>

          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            emptyMessage="Nenhum filme encontrado"
            emptyDescription="Tente ajustar os filtros ou buscar por outros termos"
            loadingCount={10}
          />
        </>
      )}
    </SearchContainer>
  );
};

export default SearchPage; 