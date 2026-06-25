import {
  ListBase,
  RecordRepresentation,
  ShowBase,
  useListContext,
  useShowContext,
  useTranslate,
} from "ra-core";
import { EditButton } from "@/components/admin/edit-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

import type { Animal, Consultation, Vaccination } from "../types";
import { AsideSection } from "../misc/AsideSection";
import { getExpiryStatus } from "../vaccinations/expiryStatus";

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
          <ReferenceField reference="contacts" source="owner_id" link="show">
            <RecordRepresentation />
          </ReferenceField>
        </AsideSection>
        <AnimalConsultationsAside animalId={record.id} />
        <AnimalVaccinationsAside animalId={record.id} />
      </div>
    </div>
  );
};

/**
 * Aside panel showing the consultations for this animal,
 * with a link to create a new one pre-linked to this animal.
 */
const AnimalConsultationsAside = ({
  animalId,
}: {
  animalId: number | string;
}) => {
  const translate = useTranslate();

  return (
    <AsideSection
      title={translate("resources.consultations.name", { smart_count: 2 })}
    >
      <ListBase
        resource="consultations"
        filter={{ "animal_id@eq": animalId }}
        sort={{ field: "date", order: "DESC" }}
        perPage={10}
        disableSyncWithLocation
        storeKey={false}
      >
        <ConsultationsListContent animalId={animalId} />
      </ListBase>
    </AsideSection>
  );
};

const ConsultationsListContent = ({
  animalId,
}: {
  animalId: number | string;
}) => {
  const { data: consultations, isPending } = useListContext<Consultation>();
  const translate = useTranslate();

  return (
    <div className="flex flex-col gap-1">
      {isPending && (
        <span className="text-muted-foreground text-xs">
          {translate("crm.common.loading")}
        </span>
      )}
      {!isPending &&
        consultations?.map((c) => (
          <Link
            key={c.id}
            to={`/consultations/${c.id}/show`}
            className="hover:underline block"
          >
            <span className="font-medium">
              {new Date(c.date).toLocaleDateString()}
            </span>
            <span className="text-muted-foreground ml-2 text-xs">
              {c.reason}
            </span>
          </Link>
        ))}
      {!isPending && (!consultations || consultations.length === 0) && (
        <span className="text-muted-foreground text-xs">
          {translate("resources.consultations.empty.title")}
        </span>
      )}
      <div className="mt-2">
        <Link
          to="/consultations/create"
          state={{ record: { animal_id: animalId } }}
          className="text-xs text-primary hover:underline"
        >
          {translate("resources.consultations.action.add")}
        </Link>
      </div>
    </div>
  );
};

/**
 * Aside panel showing the vaccinations for this animal,
 * with expiry status indicators and a link to create a new one.
 */
const AnimalVaccinationsAside = ({
  animalId,
}: {
  animalId: number | string;
}) => {
  const translate = useTranslate();

  return (
    <AsideSection
      title={translate("resources.vaccinations.name", { smart_count: 2 })}
    >
      <ListBase
        resource="vaccinations"
        filter={{ "animal_id@eq": animalId }}
        sort={{ field: "administered_on", order: "DESC" }}
        perPage={10}
        disableSyncWithLocation
        storeKey={false}
      >
        <VaccinationsListContent animalId={animalId} />
      </ListBase>
    </AsideSection>
  );
};

const EXPIRY_STATUS_CLASSES: Record<
  "expired" | "expiring_soon" | "valid",
  string
> = {
  expired: "text-destructive",
  expiring_soon: "text-yellow-600 dark:text-yellow-400",
  valid: "text-green-600 dark:text-green-400",
};

const VaccinationsListContent = ({
  animalId,
}: {
  animalId: number | string;
}) => {
  const { data: vaccinations, isPending } = useListContext<Vaccination>();
  const translate = useTranslate();

  return (
    <div className="flex flex-col gap-1">
      {isPending && (
        <span className="text-muted-foreground text-xs">
          {translate("crm.common.loading")}
        </span>
      )}
      {!isPending &&
        vaccinations?.map((v) => {
          const expiryStatus = getExpiryStatus(v.expires_on);
          return (
            <Link
              key={v.id}
              to={`/vaccinations/${v.id}/show`}
              className="hover:underline block"
            >
              <span className="font-medium">{v.vaccine_name}</span>
              <span
                className={`ml-2 text-xs font-medium ${EXPIRY_STATUS_CLASSES[expiryStatus]}`}
              >
                {translate(
                  `resources.vaccinations.expiry_status.${expiryStatus}`,
                )}
              </span>
            </Link>
          );
        })}
      {!isPending && (!vaccinations || vaccinations.length === 0) && (
        <span className="text-muted-foreground text-xs">
          {translate("resources.vaccinations.empty.title")}
        </span>
      )}
      <div className="mt-2">
        <Link
          to="/vaccinations/create"
          state={{ record: { animal_id: animalId } }}
          className="text-xs text-primary hover:underline"
        >
          {translate("resources.vaccinations.action.add")}
        </Link>
      </div>
    </div>
  );
};
