import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import MoviePoster from '../components/movie/MoviePoster';
import MovieRating from '../components/movie/MovieRating';
import MovieDetailsCard from '../components/movie/MovieDetailsCard';
import { normalizeMovieData, isValidValue } from '../utils/movieUtils';
import { 
  FiCalendar, 
  FiClock, 
  FiGlobe, 
  FiUser, 
  FiAward,
  FiArrowLeft
} from 'react-icons/fi';

const DetailsContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.button.primary};
    border-color: ${({ theme }) => theme.colors.button.primary};
  }
`;

const MovieHero = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const MovieInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MovieTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const MovieMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const PlotSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PlotText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MovieDetailsPage = () => {
  const { imdbId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (imdbId) {
      loadMovieDetails();
    }
  }, [imdbId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await movieService.getMovieDetails(imdbId);
      
      if (details.Response === 'True' || details.success) {
        setMovie(details);
      } else {
        setError(details.Error || details.error || 'Filme não encontrado');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DetailsContainer>
        <LoadingContainer>Carregando detalhes do filme...</LoadingContainer>
      </DetailsContainer>
    );
  }

  if (error) {
    return (
      <DetailsContainer>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Voltar
        </BackButton>
        <ErrorContainer>
          <h2>Erro ao carregar filme</h2>
          <p>{error}</p>
        </ErrorContainer>
      </DetailsContainer>
    );
  }

  if (!movie) return null;

  const data = normalizeMovieData(movie);

  const castCrewItems = [
    { label: 'Diretor:', value: data.director },
    { label: 'Roteiro:', value: data.writer },
    { label: 'Atores:', value: data.actors }
  ];

  const technicalItems = [
    { label: 'Gênero:', value: data.genre },
    { label: 'Idioma:', value: data.language },
    { label: 'Classificação:', value: data.rated },
    { label: 'Lançamento:', value: data.released },
    { label: 'Bilheteria:', value: data.boxOffice },
    { label: 'Prêmios:', value: data.awards }
  ];

  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft />
        Voltar
      </BackButton>

      <MovieHero>
        <MoviePoster poster={data.poster} title={data.title} />

        <MovieInfo>
          <MovieTitle>{data.title}</MovieTitle>
          
          <MovieMeta>
            {isValidValue(data.year) && (
              <MetaItem><FiCalendar />{data.year}</MetaItem>
            )}
            {isValidValue(data.runtime) && (
              <MetaItem><FiClock />{data.runtime}</MetaItem>
            )}
            {isValidValue(data.country) && (
              <MetaItem><FiGlobe />{data.country}</MetaItem>
            )}
          </MovieMeta>

          <MovieRating rating={data.imdbRating} votes={data.imdbVotes} />

          {isValidValue(data.plot) && (
            <PlotSection>
              <PlotText>{data.plot}</PlotText>
            </PlotSection>
          )}
        </MovieInfo>
      </MovieHero>

      <DetailsGrid>
        <MovieDetailsCard 
          title="Elenco e Equipe" 
          icon={FiUser} 
          items={castCrewItems} 
        />
        <MovieDetailsCard 
          title="Informações Técnicas" 
          icon={FiAward} 
          items={technicalItems} 
        />
      </DetailsGrid>
    </DetailsContainer>
  );
};

export default MovieDetailsPage; 