import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiCalendar, FiImage } from 'react-icons/fi';

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.button.primary}40;
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background: ${({ theme }) => theme.colors.accent};
  overflow: hidden;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.accent} 0%, 
    ${({ theme }) => theme.colors.secondary} 100%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PlaceholderIcon = styled(FiImage)`
  font-size: 48px;
  opacity: 0.5;
`;

const MovieInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
`;

const YearInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-left: auto;
`;

const StarIcon = styled(FiStar)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.rating.star};
`;

const RatingText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MovieType = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.overlay};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  backdrop-filter: blur(10px);
`;

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const normalizeMovie = (movieData) => {
    return {
      title: movieData.Title || movieData.title,
      year: movieData.Year || movieData.year,
      imdbId: movieData.imdbID || movieData.imdbId,
      type: movieData.Type || movieData.type,
      poster: movieData.Poster || movieData.poster,
      imdbRating: movieData.imdbRating || movieData.ImdbRating
    };
  };

  const normalizedMovie = normalizeMovie(movie);

  const handleClick = () => {
    if (normalizedMovie.imdbId) {
      navigate(`/movie/${normalizedMovie.imdbId}`);
    }
  };

  const getPosterUrl = () => {
    if (normalizedMovie.poster && normalizedMovie.poster !== 'N/A') {
      return normalizedMovie.poster;
    }
    return null;
  };

  const formatYear = (year) => {
    if (!year || year === 'N/A') return '';
    return year;
  };

  const formatType = (type) => {
    if (!type || type === 'N/A') return null;
    const typeMap = {
      'movie': 'Filme',
      'series': 'Série',
      'episode': 'Episódio'
    };
    return typeMap[type.toLowerCase()] || type;
  };

  const getRating = () => {
    if (normalizedMovie.imdbRating && normalizedMovie.imdbRating !== 'N/A') {
      return parseFloat(normalizedMovie.imdbRating);
    }
    const year = parseInt(normalizedMovie.year);
    if (year && year > 2000) {
      return Math.min(9.5, 6.5 + ((year - 2000) * 0.05));
    }
    return null;
  };

  const posterUrl = getPosterUrl();
  const formattedYear = formatYear(normalizedMovie.year);
  const formattedType = formatType(normalizedMovie.type);
  const rating = getRating();

  return (
    <CardContainer onClick={handleClick} role="button" tabIndex={0}>
      <PosterContainer>
        {posterUrl ? (
          <PosterImage 
            src={posterUrl} 
            alt={`Poster de ${normalizedMovie.title}`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        
        <PosterPlaceholder style={{ display: posterUrl ? 'none' : 'flex' }}>
          <PlaceholderIcon />
        </PosterPlaceholder>

        {formattedType && (
          <MovieType>{formattedType}</MovieType>
        )}
      </PosterContainer>

      <MovieInfo>
        <MovieTitle>{normalizedMovie.title}</MovieTitle>
        
        <MovieMeta>
          {formattedYear && (
            <YearInfo>
              <FiCalendar size={14} />
              {formattedYear}
            </YearInfo>
          )}
          
          {rating && (
            <RatingContainer>
              <StarIcon />
              <RatingText>{rating.toFixed(1)}</RatingText>
            </RatingContainer>
          )}
        </MovieMeta>
      </MovieInfo>
    </CardContainer>
  );
};

export default MovieCard; 