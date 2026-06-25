import { required, useTranslate } from "ra-core";
import { DateInput } from "@/components/admin/date-input";
import { TextInput } from "@/components/admin/text-input";
import { FileInput } from "@/components/admin/file-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

import { AttachmentField } from "../notes/AttachmentField";
import type { Animal } from "../types";

/**
 * Shared form inputs for ConsultationCreate and ConsultationEdit.
 * The animal_id field may be pre-set via defaultValues when creating
 * from the animal show page.
 */
export const ConsultationInputs = ({
  hideAnimalField = false,
}: {
  hideAnimalField?: boolean;
}) => (
  <div className="flex flex-col gap-4">
    <ConsultationCoreInputs hideAnimalField={hideAnimalField} />
    <ConsultationAttachmentsInput />
  </div>
);

const ConsultationCoreInputs = ({
  hideAnimalField,
}: {
  hideAnimalField: boolean;
}) => {
  const translate = useTranslate();
  const animalOptionRenderer = (choice: Animal) => choice?.name ?? "";

  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.consultations.field_categories.details")}
      </h6>

      {!hideAnimalField && (
        <ReferenceInput
          reference="animals"
          source="animal_id"
          sort={{ field: "name", order: "ASC" }}
        >
          <AutocompleteInput
            helperText={false}
            optionText={animalOptionRenderer}
            validate={required()}
          />
        </ReferenceInput>
      )}

      <DateInput source="date" validate={required()} helperText={false} />
      <TextInput source="reason" validate={required()} helperText={false} />
      <TextInput source="diagnosis" multiline helperText={false} />
      <TextInput source="treatment" multiline helperText={false} />
      <DateInput source="next_appointment" helperText={false} />
    </div>
  );
};

const ConsultationAttachmentsInput = () => {
  const translate = useTranslate();

  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.consultations.field_categories.attachments")}
      </h6>
      <FileInput source="attachments" multiple helperText={false}>
        <AttachmentField source="src" title="title" target="_blank" />
      </FileInput>
    </div>
  );
};
