import React from 'react';
import styled from 'styled-components';
import { FiImage } from 'react-icons/fi';

const PosterContainer = styled.div`
  position: relative;
  aspect-ratio: 2/3;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 300px;
    justify-self: center;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const MoviePoster = ({ poster, title, className }) => {
  const posterUrl = poster && poster !== 'N/A' ? poster : null;

  return (
    <PosterContainer className={className}>
      {posterUrl ? (
        <PosterImage 
          src={posterUrl} 
          alt={`Poster de ${title}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <PosterPlaceholder style={{ display: posterUrl ? 'none' : 'flex' }}>
        <FiImage size={64} />
      </PosterPlaceholder>
    </PosterContainer>
  );
};

export default MoviePoster; 