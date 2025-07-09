import React from 'react';
import styled from 'styled-components';
import { FiStar } from 'react-icons/fi';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StarIcon = styled(FiStar)`
  color: ${({ theme }) => theme.colors.rating.star};
  font-size: 20px;
`;

const RatingText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RatingSubtext = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MovieRating = ({ rating, votes }) => {
  if (!rating || rating === 'N/A') return null;

  const formatRating = (rating) => {
    const num = parseFloat(rating);
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  return (
    <RatingContainer>
      <StarIcon />
      <RatingText>{formatRating(rating)}</RatingText>
      <RatingSubtext>/ 10</RatingSubtext>
      {votes && votes !== 'N/A' && (
        <RatingSubtext>({votes} votos)</RatingSubtext>
      )}
    </RatingContainer>
  );
};

export default MovieRating; 