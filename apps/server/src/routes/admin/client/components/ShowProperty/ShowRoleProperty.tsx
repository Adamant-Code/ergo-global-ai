import {
  RecordJSON,
  PropertyJSON,
  ResourceJSON,
  ShowPropertyProps,
} from "adminjs";
import React, { FC } from "react";
import ShowPropertyWrapper from "./ShowPropertyWrapper.js";
import RoleProperty from "../ListProperty/ListEmailProperty.js";

const ShowRoleProperty: FC<ShowPropertyProps> = ({
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
      <RoleProperty
        record={record}
        property={property}
        resource={resource}
      />
    </ShowPropertyWrapper>
  );
};

export default ShowRoleProperty;
