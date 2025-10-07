import React from "react";
import { Box, Text, Icon } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";
import { StatCardProps } from "../../types/dashboard/index.js";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  iconColor,
}) => {
  const displayValue =
    value === undefined || value === null ? "-" : value;
  const iconDisplayColor = iconColor || "primary100";

  return (
    <StyledStatCard>
      <IconCircle $color={iconColor}>
        <Icon
          icon={icon}
          size={28}
          color={iconDisplayColor}
        />
      </IconCircle>
      <StatLabel>{label}</StatLabel>
      <StatValue>{displayValue}</StatValue>
    </StyledStatCard>
  );
};

const StyledStatCard = styled(Box)`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

const StatLabel = styled(Text)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const StatValue = styled(Text)`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary100};
`;

const IconCircle = styled(Box)<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $color, theme }) =>
    $color ? `${$color}1A` : theme.colors.primary10};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

export default StatCard;
