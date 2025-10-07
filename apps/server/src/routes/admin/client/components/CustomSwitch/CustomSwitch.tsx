import React, { FC } from "react";
import { Box, Icon } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

interface SwitchProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const SwitchContainer = styled(Box)<{
  isActive: boolean;
  isDisabled?: boolean;
}>`
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ isActive, theme, isDisabled }) =>
    isDisabled
      ? theme.colors.grey40
      : isActive
      ? theme.colors.success100
      : theme.colors.grey60};
  cursor: ${({ isDisabled }) =>
    isDisabled ? "not-allowed" : "pointer"};
  transition: background-color 0.2s;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
`;

const SwitchKnob = styled(Box)<{ isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ isActive }) => (isActive ? "calc(100% - 22px)" : "2px")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const CustomSwitch: FC<SwitchProps> = ({
  id,
  name,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <SwitchContainer
      id={id}
      name={name}
      isActive={checked}
      isDisabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange();
        }
      }}
    >
      <SwitchKnob isActive={checked}>
        <IconWrapper>
          <Icon
            icon={checked ? "X" : "Check"}
            size={12}
            color={checked ? "error100" : "success100"}
          />
        </IconWrapper>
      </SwitchKnob>
    </SwitchContainer>
  );
};

export default CustomSwitch;
