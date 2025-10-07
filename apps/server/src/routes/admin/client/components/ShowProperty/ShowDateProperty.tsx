import {
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import React, { FC } from "react";
import ShowPropertyWrapper from "./ShowPropertyWrapper.js";
import DateProperty from "../ListProperty/ListDateProperty.js";

const ShowDateProperty: FC<ShowPropertyProps> = ({
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
      <DateProperty
        record={record}
        property={property}
        resource={resource}
      />
    </ShowPropertyWrapper>
  );
};

export default ShowDateProperty;
