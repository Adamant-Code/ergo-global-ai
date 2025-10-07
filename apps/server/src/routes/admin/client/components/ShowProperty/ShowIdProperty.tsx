import {
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import React, { FC } from "react";
import IdProperty from "../ListProperty/ListIdProperty.js";
import ShowPropertyWrapper from "./ShowPropertyWrapper.js";

const ShowIdProperty: FC<ShowPropertyProps> = ({
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
      <IdProperty
        record={record}
        property={property}
        resource={resource}
      />
    </ShowPropertyWrapper>
  );
};

export default ShowIdProperty;
