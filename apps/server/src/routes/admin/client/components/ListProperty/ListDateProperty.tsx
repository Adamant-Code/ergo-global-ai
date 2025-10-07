import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";
import { Box, Text, Icon } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const ListDateProperty: FC<ShowPropertyProps> = ({
  record,
  property,
}) => {
  const rawDate = record?.params?.[property.name];

  if (!rawDate) return <Text color="grey40">—</Text>;

  const date = new Date(rawDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formattedDate;
  };

  const relativeTime = getRelativeTime(date);

  let iconName = "Calendar";
  if (property.name === "createdAt") iconName = "Plus";
  if (property.name === "updatedAt") iconName = "Edit";

  return (
    <DateContainer>
      <Icon
        size={14}
        icon={iconName}
        color="primary100"
      />
      <TextWrapper>
        <DateValue>
          {formattedDate} at {formattedTime}
        </DateValue>
        <TimeContainer
          fontSize="xs"
          color="grey60"
        >
          {relativeTime}
        </TimeContainer>
      </TextWrapper>
    </DateContainer>
  );
};

const TextWrapper = styled(Box)`
  word-wrap: normal;
  word-break: keep-all;
  white-space: nowrap;
`;

const TimeContainer = styled(Text)`
  word-wrap: normal;
  word-break: keep-all;
`;

const DateContainer = styled(Box)`
  gap: 8px;
  display: flex;
  padding: 6px 10px;
  border-radius: 6px;
  align-items: center;
  transition: all 0.2s ease;
  background-color: ${({ theme }) => theme.colors.filterBg};

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey20};
  }
`;

const DateValue = styled(Text)`
  font-size: 13px;
  word-wrap: normal;
  word-break: keep-all;
  letter-spacing: -0.01em;
  font-family: "Inter", sans-serif;
`;

export default ListDateProperty;
