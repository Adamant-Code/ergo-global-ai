import {
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import React, { FC } from "react";
import ShowPropertyWrapper from "./ShowPropertyWrapper.js";
import EmailProperty from "../ListProperty/ListEmailProperty.js";

const ShowEmailProperty: FC<ShowPropertyProps> = ({
  record,
  property,
  resource,
}: {
  record: RecordJSON;
  resource: ResourceJSON;
  property: PropertyJSON;
}) => {
  return (
    <ShowPropertyWrapper
      record={record}
      property={property}
    >
      <EmailProperty
        record={record}
        property={property}
        resource={resource}
      />
    </ShowPropertyWrapper>
  );
};

export default ShowEmailProperty;
