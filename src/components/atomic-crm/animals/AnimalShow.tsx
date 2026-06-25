import {
  RecordRepresentation,
  ShowBase,
  useShowContext,
  useTranslate,
} from "ra-core";
import { EditButton } from "@/components/admin/edit-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

import type { Animal } from "../types";
import { AsideSection } from "../misc/AsideSection";

/**
 * Show page for an animal patient.
 */
export const AnimalShow = () => (
  <ShowBase>
    <AnimalShowContent />
  </ShowBase>
);

const AnimalShowContent = () => {
  const { record, isPending } = useShowContext<Animal>();
  const translate = useTranslate();

  if (isPending || !record) return null;

  return (
    <div className="mt-2 mb-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-semibold">{record.name}</h5>
              <EditButton />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.animals.fields.species")}
                </span>
                <div>{record.species}</div>
              </div>
              {record.breed && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.animals.fields.breed")}
                  </span>
                  <div>{record.breed}</div>
                </div>
              )}
              {record.date_of_birth && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.animals.fields.date_of_birth")}
                  </span>
                  <div>
                    <DateField source="date_of_birth" />
                  </div>
                </div>
              )}
              {record.weight_kg != null && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.animals.fields.weight_kg")}
                  </span>
                  <div>
                    <NumberField source="weight_kg" /> kg
                  </div>
                </div>
              )}
              {record.microchip_number && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    {translate("resources.animals.fields.microchip_number")}
                  </span>
                  <div>{record.microchip_number}</div>
                </div>
              )}
              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.animals.fields.status")}
                </span>
                <div>
                  {translate(`resources.animals.status.${record.status}`)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden sm:block w-72 min-w-72 text-sm">
        <AsideSection title={translate("resources.animals.fields.owner_id")}>
          <ReferenceField
            reference="contacts"
            source="owner_id"
            link="show"
          >
            <RecordRepresentation />
          </ReferenceField>
        </AsideSection>
      </div>
    </div>
  );
};
