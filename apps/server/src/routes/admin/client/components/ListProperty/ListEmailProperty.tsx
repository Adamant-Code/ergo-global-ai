import React, { FC } from "react";
import {
  useNotice,
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import { Box, Text, Icon, Tooltip } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const ListEmailProperty: FC<ShowPropertyProps> = ({
  record,
  property,
}: {
  record: RecordJSON;
  resource: ResourceJSON;
  property: PropertyJSON;
}) => {
  const sendNotice = useNotice();
  const email = record?.params?.[property.name];

  if (!email || typeof email !== "string")
    return <Text color="grey40">—</Text>;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    sendNotice({
      type: "success",
      message: "Email successfully copied to clipboard",
    });
  };

  const getDomain = (email: string) => {
    const parts = email.split("@");
    return parts.length > 1 ? parts[1] : "";
  };

  const domain = getDomain(email);

  // Generate color based on email domain
  const getProviderInfo = (domain: string) => {
    const providers: Record<string, { icon: string; color: string }> =
      {
        "gmail.com": { icon: "Mail", color: "#D93025" },
        "yahoo.com": { icon: "Mail", color: "#5F01D1" },
        "hotmail.com": { icon: "Mail", color: "#0078D4" },
        "outlook.com": { icon: "Mail", color: "#0078D4" },
        "icloud.com": { icon: "Mail", color: "#999999" },
        "protonmail.com": { icon: "Shield", color: "#6D4AFF" },
        "aol.com": { icon: "Mail", color: "#31459B" },
      };

    return providers[domain] || { icon: "Mail", color: "#4361ee" };
  };

  const { icon, color } = getProviderInfo(domain);

  return (
    <EmailContainer>
      <Icon
        size={16}
        icon={icon}
        color={color}
      />

      <Box>
        <EmailText>{email}</EmailText>
        <DomainBadge>{domain}</DomainBadge>
      </Box>

      <Box
        gap="sm"
        ml="auto"
        display="flex"
      >
        <Tooltip
          title="Copy Email"
          direction="top"
        >
          <ActionButton onClick={copyToClipboard}>
            <Icon
              size={14}
              icon="Copy"
              color="primary100"
            />
          </ActionButton>
        </Tooltip>

        <Tooltip
          direction="top"
          title="Send Email"
        >
          <ActionButton
            as="a"
            href={`mailto:${email}`}
            rel="noopener noreferrer"
          >
            <Icon
              size={14}
              icon="Send"
              color="primary100"
            />
          </ActionButton>
        </Tooltip>
      </Box>
    </EmailContainer>
  );
};

const EmailContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.filterBg};
  transition: all 0.2s ease-in-out;
  max-width: fit-content;

  &:hover {
    transform: translateY(-1px);
    background-color: ${({ theme }) => theme.colors.primary20};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const EmailText = styled(Text)`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  letter-spacing: -0.01em;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
    word-wrap: normal;
  word-break: keep-all;
`;

const ActionButton = styled(Box)`
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey20};
  }
`;

const DomainBadge = styled(Box)`
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.grey20};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grey100};
`;

export default ListEmailProperty;
