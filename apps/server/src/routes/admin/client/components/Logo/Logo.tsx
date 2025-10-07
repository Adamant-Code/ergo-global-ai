import React, { FC } from 'react';
import { BrandingOptions } from 'adminjs';
import { Box, Text } from '@adminjs/design-system';
import styled from '@adminjs/design-system/styled-components';

interface CustomLogoProps {
  branding: BrandingOptions;
}

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding-left: ${({ theme }) => theme.space.md};
`;

const CompanyNameText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;
`;

const CustomLogo: FC<CustomLogoProps> = ({ branding }) => {
  const companyName = branding.companyName || 'Admin Panel';

  return (
    <LogoContainer>
      <CompanyNameText>{companyName}</CompanyNameText>
    </LogoContainer>
  );
};

// Export the component
export default CustomLogo;
