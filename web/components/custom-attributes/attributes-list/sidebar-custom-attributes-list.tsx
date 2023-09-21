import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// components
import {
  CustomCheckboxAttribute,
  CustomDateTimeAttribute,
  CustomEmailAttribute,
  CustomFileAttribute,
  CustomNumberAttribute,
  CustomRelationAttribute,
  CustomSelectAttribute,
  CustomTextAttribute,
  CustomUrlAttribute,
} from "components/custom-attributes";
// ui
import { Loader } from "components/ui";
// types
import { ICustomAttributeValueFormData, IIssue } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  issue: IIssue | undefined;
  projectId: string;
};

export const SidebarCustomAttributesList: React.FC<Props> = observer(({ issue, projectId }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes, customAttributeValues } = useMobxStore();

  const handleAttributeUpdate = (attributeId: string, value: string | string[] | undefined) => {
    if (!issue || !workspaceSlug) return;

    if (!value) {
      customAttributeValues.deleteAttributeValue(
        workspaceSlug.toString(),
        projectId,
        issue.id,
        attributeId
      );
      return;
    }

    const payload: ICustomAttributeValueFormData = {
      issue_properties: {
        [attributeId]: Array.isArray(value) ? value : [value],
      },
    };

    customAttributeValues.createAttributeValue(
      workspaceSlug.toString(),
      issue.project,
      issue.id,
      payload
    );
  };

  // fetch the object details if object state has id
  useEffect(() => {
    if (!issue?.entity) return;

    if (!customAttributes.objectAttributes[issue.entity]) {
      if (!workspaceSlug) return;

      customAttributes.fetchObjectDetails(workspaceSlug.toString(), issue.entity);
    }
  }, [customAttributes, issue?.entity, workspaceSlug]);

  // fetch issue attribute values
  useEffect(() => {
    if (!issue) return;

    if (
      !customAttributeValues.issueAttributeValues ||
      !customAttributeValues.issueAttributeValues[issue.id]
    ) {
      if (!workspaceSlug) return;

      customAttributeValues.fetchIssueAttributeValues(
        workspaceSlug.toString(),
        issue.project,
        issue.id
      );
    }
  }, [customAttributeValues, issue, workspaceSlug]);

  if (!issue || !issue?.entity) return null;

  if (
    !customAttributes.objectAttributes[issue.entity] ||
    !customAttributeValues.issueAttributeValues?.[issue.id]
  )
    return (
      <Loader className="space-y-4">
        <Loader.Item height="30px" />
        <Loader.Item height="30px" />
        <Loader.Item height="30px" />
        <Loader.Item height="30px" />
      </Loader>
    );

  return (
    <div>
      {Object.values(customAttributes.objectAttributes?.[issue.entity] ?? {}).map((attribute) => {
        const typeMetaData = CUSTOM_ATTRIBUTES_LIST[attribute.type];
        const attributeValue = customAttributeValues.issueAttributeValues?.[issue.id].find(
          (a) => a.id === attribute.id
        )?.prop_value;

        return (
          <div key={attribute.id} className="flex items-center flex-wrap py-2">
            <div className="flex-grow truncate flex items-center gap-x-2 text-sm text-custom-text-200 sm:w-1/2">
              <typeMetaData.icon className="flex-shrink-0" size={16} strokeWidth={1.5} />
              <p className="truncate">{attribute.display_name}</p>
            </div>
            <div className="flex-shrink-0 sm:w-1/2">
              {attribute.type === "checkbox" && (
                <CustomCheckboxAttribute
                  attributeDetails={attribute}
                  onChange={(val) => handleAttributeUpdate(attribute.id, [`${val}`])}
                  value={
                    attributeValue ? (attributeValue?.[0]?.value === "true" ? true : false) : false
                  }
                />
              )}
              {attribute.type === "datetime" && (
                <CustomDateTimeAttribute
                  attributeDetails={attribute}
                  onChange={(val) => {
                    handleAttributeUpdate(attribute.id, val ? [val.toISOString()] : undefined);
                  }}
                  value={attributeValue ? new Date(attributeValue?.[0]?.value ?? "") : undefined}
                />
              )}
              {attribute.type === "email" && (
                <CustomEmailAttribute
                  attributeDetails={attribute}
                  onChange={(val) => {
                    handleAttributeUpdate(attribute.id, val && val !== "" ? [val] : undefined);
                  }}
                  value={attributeValue ? attributeValue?.[0]?.value : undefined}
                />
              )}
              {attribute.type === "file" && (
                <CustomFileAttribute
                  attributeDetails={attribute}
                  onChange={(val) => handleAttributeUpdate(attribute.id, val)}
                  value={attributeValue ? attributeValue?.[0]?.value : undefined}
                />
              )}
              {attribute.type === "multi_select" && (
                <CustomSelectAttribute
                  attributeDetails={attribute}
                  onChange={(val) => handleAttributeUpdate(attribute.id, val)}
                  value={Array.isArray(attributeValue) ? attributeValue.map((v) => v.value) : []}
                  multiple
                />
              )}
              {attribute.type === "number" && (
                <CustomNumberAttribute
                  attributeDetails={attribute}
                  onChange={(val) => {
                    handleAttributeUpdate(attribute.id, val ? [val.toString()] : undefined);
                  }}
                  value={
                    attributeValue ? parseInt(attributeValue?.[0]?.value ?? "0", 10) : undefined
                  }
                />
              )}
              {attribute.type === "relation" && (
                <CustomRelationAttribute
                  attributeDetails={attribute}
                  onChange={(val) => handleAttributeUpdate(attribute.id, val)}
                  projectId={issue.project}
                  value={attributeValue ? attributeValue?.[0]?.value : undefined}
                />
              )}
              {attribute.type === "select" && (
                <CustomSelectAttribute
                  attributeDetails={attribute}
                  onChange={(val) => handleAttributeUpdate(attribute.id, val)}
                  value={attributeValue ? attributeValue?.[0]?.value : undefined}
                  multiple={false}
                />
              )}
              {attribute.type === "text" && (
                <CustomTextAttribute
                  attributeDetails={attribute}
                  onChange={(val) =>
                    handleAttributeUpdate(attribute.id, val && val !== "" ? [val] : undefined)
                  }
                  value={attributeValue ? attributeValue?.[0].value : undefined}
                />
              )}
              {attribute.type === "url" && (
                <CustomUrlAttribute
                  attributeDetails={attribute}
                  onChange={(val) =>
                    handleAttributeUpdate(attribute.id, val && val !== "" ? [val] : undefined)
                  }
                  value={attributeValue ? attributeValue?.[0]?.value : undefined}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
