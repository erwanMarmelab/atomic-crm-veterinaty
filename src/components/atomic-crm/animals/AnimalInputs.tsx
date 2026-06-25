import { required, useTranslate } from "ra-core";
import { NumberInput } from "@/components/admin/number-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";
import { DateInput } from "@/components/admin/date-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

import type { Contact } from "../types";

const ANIMAL_STATUS_CHOICES = [
  { id: "active", name: "resources.animals.status.active" },
  { id: "deceased", name: "resources.animals.status.deceased" },
  { id: "lost", name: "resources.animals.status.lost" },
];

/**
 * Shared form inputs for AnimalCreate and AnimalEdit.
 */
export const AnimalInputs = () => (
  <div className="flex flex-col gap-4">
    <AnimalIdentityInputs />
    <AnimalMedicalInputs />
    <AnimalOwnerInput />
  </div>
);

const AnimalIdentityInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.animals.field_categories.identity")}
      </h6>
      <TextInput
        source="name"
        validate={required()}
        helperText={false}
      />
      <TextInput
        source="species"
        validate={required()}
        helperText={false}
      />
      <TextInput source="breed" helperText={false} />
    </div>
  );
};

const AnimalMedicalInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.animals.field_categories.medical")}
      </h6>
      <DateInput source="date_of_birth" helperText={false} />
      <NumberInput source="weight_kg" helperText={false} min={0} step={0.1} />
      <TextInput source="microchip_number" helperText={false} />
      <SelectInput
        source="status"
        choices={ANIMAL_STATUS_CHOICES}
        defaultValue="active"
        helperText={false}
      />
    </div>
  );
};

const AnimalOwnerInput = () => {
  const translate = useTranslate();
  const contactOptionRenderer = (choice: Contact) =>
    `${choice.first_name} ${choice.last_name}`;
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.animals.field_categories.owner")}
      </h6>
      <ReferenceInput
        reference="contacts"
        source="owner_id"
        sort={{ field: "last_name", order: "ASC" }}
      >
        <AutocompleteInput
          helperText={false}
          optionText={contactOptionRenderer}
          validate={required()}
        />
      </ReferenceInput>
    </div>
  );
};
