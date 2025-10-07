import { ComponentLoader } from "adminjs";

/************************************************************************
 * The `componentLoader` is used to register all custom components.
 * To register your custom components, pass the following to the `add` method:
 *
 * @param name An arbitrary name as the first argument. This becomes the name used to access your custom components.
 * @param filePath The second argument is the relative path to where the custom component is defined.
 * @param caller An optional third argument that tells AdminJS where to resolve the filePath from. It's the base directory that the filePath is relative to.
 */
export const componentLoader = new ComponentLoader();

export const Components = {
  Dashboard: componentLoader.add(
    "Dashboard",
    "../client/components/Dashboard/Dashboard"
  ),

  ListRecordLinkProperty: componentLoader.add(
    "ListRecordLinkProperty",
    "../client/components/ListProperty/ListRecordLinkProperty"
  ),

  EditPasswordProperty: componentLoader.add(
    "EditPasswordProperty",
    "../client/components/EditProperty/EditPasswordProperty"
  ),

  DifferenceRecordProperty: componentLoader.add(
    "DifferenceRecordProperty",
    "../client/components/DifferenceProperty/DifferenceRecordProperty"
  ),
};

componentLoader.override("Login", "../client/components/Login/Login");
