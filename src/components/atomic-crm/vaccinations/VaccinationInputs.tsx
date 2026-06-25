import { required, useTranslate } from "ra-core";
import { DateInput } from "@/components/admin/date-input";
import { NumberInput } from "@/components/admin/number-input";
import { TextInput } from "@/components/admin/text-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";

import type { Animal } from "../types";

/**
 * Shared form inputs for VaccinationCreate and VaccinationEdit.
 * The animal_id field may be pre-set via router state when creating
 * from the animal show page (hideAnimalField=true).
 * expires_on is computed by the DB view and is never in the form.
 */
export const VaccinationInputs = ({
  hideAnimalField = false,
}: {
  hideAnimalField?: boolean;
}) => {
  const translate = useTranslate();
  const animalOptionRenderer = (choice: Animal) => choice?.name ?? "";

  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.vaccinations.field_categories.details")}
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

      <TextInput
        source="vaccine_name"
        validate={required()}
        helperText={false}
      />
      <DateInput
        source="administered_on"
        validate={required()}
        helperText={false}
      />
      <NumberInput
        source="validity_months"
        validate={required()}
        helperText={false}
        min={1}
      />
    </div>
  );
};
