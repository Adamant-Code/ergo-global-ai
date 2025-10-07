import React, { FC, useState, useEffect } from "react";
import CustomSwitch from "../CustomSwitch/CustomSwitch.js";
import { EditPropertyProps, useTranslation } from "adminjs";
import { styled } from "@adminjs/design-system/styled-components";
import { Box, Text, Label, FormGroup } from "@adminjs/design-system";

const EditDisabledProperty: FC<EditPropertyProps> = (props) => {
  const { property, record, onChange } = props;
  const { translateProperty } = useTranslation();

  // Get current value from record or default to false
  const initialValue =
    record?.params?.[property.name] === true ||
    record?.params?.[property.name] === "true";

  const [isDisabled, setIsDisabled] = useState(initialValue);

  // Handle toggle change
  const handleChange = () => {
    const newValue = !isDisabled;
    setIsDisabled(newValue);
    onChange(property.name, newValue);
  };

  // Update local state if record changes externally
  useEffect(() => {
    const recordValue =
      record?.params?.[property.name] === true ||
      record?.params?.[property.name] === "true";
    if (recordValue !== isDisabled) {
      setIsDisabled(recordValue);
    }
  }, [record?.params?.[property.name]]);

  return (
    <FormGroup error={record?.errors?.[property.name]?.message}>
      <Label htmlFor={property.name}>
        {translateProperty(property.label, property.resourceId)}
      </Label>

      <ToggleContainer>
        <ToggleWrapper>
          <CustomSwitch
            id={property.name}
            name={property.name}
            checked={isDisabled}
            onChange={handleChange}
            disabled={property.isDisabled}
          />
          <Text>{isDisabled ? "Disabled" : "Enabled"}</Text>
        </ToggleWrapper>

        <StatusDescription isDisabled={isDisabled}>
          {isDisabled
            ? "This item will be inactive and unavailable for use"
            : "This item will be active and available for use"}
        </StatusDescription>
      </ToggleContainer>
    </FormGroup>
  );
};

const ToggleContainer = styled(Box)`
  gap: 8px;
  display: flex;
  flex-direction: column;
`;

const ToggleWrapper = styled(Box)`
  gap: 12px;
  display: flex;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  transition: all 0.2s;
  background-color: ${({ theme }) => theme.colors.filterBg};

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey20};
  }
`;

const StatusDescription = styled(Text)<{ isDisabled: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${({ isDisabled, theme }) =>
    isDisabled ? theme.colors.error100 : theme.colors.success100};
`;

export default EditDisabledProperty;
