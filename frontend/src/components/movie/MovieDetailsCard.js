import React from 'react';
import styled from 'styled-components';

const DetailsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}20;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  min-width: 80px;
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: right;
  flex: 1;
`;

const MovieDetailsCard = ({ title, icon: Icon, items }) => {
  const validItems = items.filter(item => item.value && item.value !== 'N/A');
  
  if (validItems.length === 0) return null;

  return (
    <DetailsCard>
      <CardTitle>
        {Icon && <Icon />}
        {title}
      </CardTitle>
      <DetailsList>
        {validItems.map((item, index) => (
          <DetailItem key={index}>
            <DetailLabel>{item.label}</DetailLabel>
            <DetailValue>{item.value}</DetailValue>
          </DetailItem>
        ))}
      </DetailsList>
    </DetailsCard>
  );
};

export default MovieDetailsCard; 