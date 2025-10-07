import React from "react";
import { Box, Text, Label } from "@adminjs/design-system";
import { RecordJSON, PropertyJSON, ResourceJSON } from "adminjs";
import { styled } from "@adminjs/design-system/styled-components";

const TitleLabel = styled(Label)`
  display: block;
  font-size: 18px;
  font-weight: 300;
  line-height: 16px;
  margin-bottom: 4px;
  word-wrap: normal;
  word-break: keep-all;
  color: rgb(137, 138, 154);
  text-transform: capitalize;
  font-family: Roboto, sans-serif;
`;

const ShowPropertyContainer = styled(Box)`
  min-width: 0px;
  font-size: 14px;
  line-height: 16px;
  font-weight: normal;
  margin-bottom: 24px;
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
`;

const ShowPropertyWrapper = ({
  record,
  property,
  children,
}: {
  record: RecordJSON;
  property: PropertyJSON;
  resource?: ResourceJSON;
  children: React.ReactNode;
}) => {
  console.log(record)
  const name = record?.params?.[property.name];

  if (typeof name === "undefined")
    return <Text color="grey40">N/A</Text>;

  return (
    <ShowPropertyContainer>
      <TitleLabel>{property.label}</TitleLabel>
      {children}
    </ShowPropertyContainer>
  );
};

export default ShowPropertyWrapper;
