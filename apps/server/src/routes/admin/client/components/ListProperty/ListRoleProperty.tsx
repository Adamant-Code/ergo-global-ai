import React, { FC } from "react";
import {
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import {
  Box,
  Text,
  Icon,
  Badge,
  Tooltip,
} from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const ListRoleProperty: FC<ShowPropertyProps> = ({
  record,
  property,
}: {
  record: RecordJSON;
  resource: ResourceJSON;
  property: PropertyJSON;
}) => {
  const role = record?.params?.[property.name];

  if (!role) return <Text color="grey40">No role assigned</Text>;

  const normalizeRole = (role: any): string => {
    if (typeof role !== "string") return String(role);
    return role.toUpperCase().replace(/ /g, "_");
  };

  const normalizedRole = normalizeRole(role);
  const config = ROLE_CONFIG[normalizedRole] || {
    icon: "User",
    color: "#9E9E9E",
    bgColor: "#EEEEEE",
    textColor: "#616161",
    description: "Custom role",
    tooltip: `Role: ${normalizedRole}`,
  };

  const formatRoleName = (role: string): string => {
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const displayRole = formatRoleName(normalizedRole);

  return (
    <RoleContainer color={config.color}>
      <RoleIcon bgColor={config.color}>
        <Icon
          icon={config.icon}
          size={18}
          color="white"
        />
      </RoleIcon>

      <Box>
        <Tooltip
          title={config.tooltip}
          direction="top"
        >
          <RoleBadge
            bgColor={config.bgColor}
            textColor={config.textColor}
          >
            {displayRole}
          </RoleBadge>
        </Tooltip>
        <RoleDescription>{config.description}</RoleDescription>
      </Box>
    </RoleContainer>
  );
};

const ROLE_CONFIG: Record<
  string,
  {
    icon: string;
    color: string;
    bgColor: string;
    tooltip: string;
    textColor: string;
    description: string;
  }
> = {
  SUPER_ADMIN: {
    icon: "Star",
    color: "#FF9800",
    bgColor: "#FFF3E0",
    textColor: "#D84315",
    description: "Full system access with all privileges",
    tooltip: "Has access to all resources and can manage users",
  },
  ADMIN: {
    icon: "Shield",
    color: "#FF5722",
    bgColor: "#FFEBEE",
    textColor: "#C62828",
    description: "Administrative access to most system features",
    tooltip: "Can manage content and some administrative settings",
  },
  EDITOR: {
    icon: "Edit",
    color: "#2196F3",
    bgColor: "#E3F2FD",
    textColor: "#1565C0",
    description: "Can create and modify content",
    tooltip:
      "Has edit access to content, but limited administrative abilities",
  },
  VIEWER: {
    icon: "Eye",
    color: "#4CAF50",
    bgColor: "#E8F5E9",
    textColor: "#2E7D32",
    description: "Read-only access to view content",
    tooltip: "Can view but not modify system content",
  },
  GUEST: {
    icon: "User",
    color: "#9E9E9E",
    bgColor: "#F5F5F5",
    textColor: "#757575",
    description: "Limited access to public resources",
    tooltip: "Has minimal view-only privileges",
  },
};

const RoleContainer = styled(Box)`
  gap: 12px;
  display: flex;
  padding: 10px 12px;
  border-radius: 8px;
  align-items: center;
  border-left: 4px solid;
  max-width: fit-content;
  transition: all 0.2s ease-in-out;
  border-left-color: ${({ color }) => color};
  background-color: ${({ theme }) => theme.colors.filterBg};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const RoleBadge = styled(Badge)<{ bgColor: string; textColor: string; }>`
  background-color: ${({ bgColor }) => bgColor};
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  word-wrap: normal;
  word-break: keep-all;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ textColor }) => textColor};
`;

const RoleIcon = styled(Box)<{ bgColor: string }>`
  width: 32px;
  height: 32px;
  display: flex;
  color: white;
  flex-shrink: 0;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor};
`;

const RoleDescription = styled(Text)`
  font-size: 12px;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.grey60};
`;

export default ListRoleProperty;
