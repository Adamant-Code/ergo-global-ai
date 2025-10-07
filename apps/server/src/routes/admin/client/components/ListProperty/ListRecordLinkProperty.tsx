import { FormGroup, Link } from "@adminjs/design-system";
import { LoggerPropertiesMapping as OriginalLoggerPropertiesMapping } from "@adminjs/logger";

// Extend LoggerPropertiesMapping to allow string indexing
type LoggerPropertiesMapping = OriginalLoggerPropertiesMapping & {
  [key: string]: string | undefined;
};
import { BasePropertyProps, ViewHelpers } from "adminjs";
import React, { FC } from "react";

const getLogPropertyName = (
  property: string,
  mapping: LoggerPropertiesMapping = {}
) => {
  if (!mapping[property]) {
    return property;
  }

  return mapping[property];
};

const viewHelpers = new ViewHelpers();
const ListRecordLinkProperty: FC<BasePropertyProps> = ({
  record,
  property,
}) => {
  if (!record?.params) {
    return null;
  }

  const { custom = {} } = property;
  const { propertiesMapping = {} } = custom;

  const recordIdParam = getLogPropertyName(
    "recordId",
    propertiesMapping
  );
  const resourceIdParam = getLogPropertyName(
    "resource",
    propertiesMapping
  );
  const recordTitleParam = getLogPropertyName(
    "recordTitle",
    propertiesMapping
  );

  const recordId = record.params[recordIdParam];
  const resource = record.params[resourceIdParam];
  const recordTitle = record.params[recordTitleParam];

  if (!recordId || !resource) {
    return null;
  }

  return (
    <FormGroup>
      <Link
        href={viewHelpers.recordActionUrl({
          actionName: "show",
          recordId,
          resourceId: resource,
        })}
      >
        {recordTitle}
      </Link>
    </FormGroup>
  );
};

export default ListRecordLinkProperty;
