import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState({
    query: '',
    type: '',
    year: '',
    page: 1
  });

  // Função de busca simplificada - sempre executa quando chamada
  const searchMovies = useCallback(async (query) => {
    if (!query.trim()) return;

    try {
      console.log('🔍 Executando busca para:', query);
      setLoading(true);
      setError(null);
      setMovies([]);
      setAllMovies([]);
      setTotalResults(0);

      const searchParams = {
        query: query,
        page: 1
      };

      const response = await movieService.searchMovies(searchParams);
      
      console.log('📦 Resposta da API:', response);
      
      if (response.Response === 'True' || response.success) {
        const movieResults = response.Search || response.search || [];
        console.log('✅ Filmes encontrados:', movieResults.length);
        setAllMovies(movieResults);
        setTotalResults(response.totalResultsAsInt || 0);
      } else {
        console.log('❌ Nenhum resultado encontrado');
        setAllMovies([]);
        setMovies([]);
        setTotalResults(0);
        setError(response.Error || response.error || 'Nenhum filme encontrado');
      }
    } catch (err) {
      console.error('💥 Erro na busca:', err);
      setError(err.message);
      setAllMovies([]);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para aplicar filtros locais
  const applyLocalFilters = useCallback(() => {
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

    console.log('🔧 Filtros aplicados:', { type: filters.type, year: filters.year });
    console.log('📄 Filmes após filtro:', filteredMovies.length, 'de', allMovies.length);

    setMovies(filteredMovies);
  }, [allMovies, filters.type, filters.year]);

  // Reset completo do estado quando componente monta ou URL muda significativamente
  useEffect(() => {
    console.log('🔄 SearchPage montou ou URL mudou:', location.pathname + location.search);
    
    // Reset completo
    setMovies([]);
    setAllMovies([]);
    setTotalResults(0);
    setError(null);
    setLoading(false);
    
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const year = searchParams.get('year') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    console.log('📝 Parâmetros da URL:', { query, type, year, page });

    const newFilters = {
      query,
      type,
      year,
      page
    };

    setFilters(newFilters);

    // Sempre executa busca se há query, sem cache
    if (query.trim()) {
      console.log('🎯 Query encontrada, executando busca...');
      searchMovies(query);
    } else {
      console.log('🧹 Sem query, mantendo estado limpo');
    }
  }, [location.search, searchMovies]);

  // Effect para aplicar filtros quando dados mudam
  useEffect(() => {
    if (allMovies.length > 0) {
      applyLocalFilters();
    }
  }, [allMovies, applyLocalFilters]);

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

  // Debug info no console
  console.log('🎬 SearchPage render:', {
    query: filters.query,
    moviesCount: movies.length,
    allMoviesCount: allMovies.length,
    loading,
    error,
    pathname: location.pathname
  });

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