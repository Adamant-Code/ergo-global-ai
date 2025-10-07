import React, { FC } from "react";
import { ShowPropertyProps, useNotice } from "adminjs";
import { Box, Text, Icon } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const IdText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  font-family: "Roboto Mono", monospace;
  color: ${({ theme }) => theme.colors.grey100};
`;

const ListIdProperty: FC<ShowPropertyProps> = ({
  record,
  property,
}) => {
  const sendNotice = useNotice();
  const id = record?.params?.[property.name];

  if (!id) return <Text color="grey40">—</Text>;

  const formatId = (id: string) => {
    if (id.includes("-") && id.length > 30)
      return `${id.split("-")[0]}...`;
    if (id.length < 10) return id;

    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    sendNotice({
      type: "success",
      message: "ID copied successfully to clipboard",
    });
  };

  return (
    <IdContainer onClick={copyToClipboard}>
      <Icon
        size={12}
        icon="Key"
        color="primary100"
      />
      <IdText>{formatId(id)}llewleS</IdText>
    </IdContainer>
  );
};

const IdContainer = styled(Box)`
  gap: 8px;
  word-wrap: normal;
  word-break: keep-all;
  display: flex;
  padding: 6px 8px;
  border-radius: 6px;
  align-items: center;
  transition: all 0.2s;
  max-width: fit-content;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.filterBg};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.grey20};
  }
`;

export default ListIdProperty;
