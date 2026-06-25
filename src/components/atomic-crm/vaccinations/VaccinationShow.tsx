import {
  RecordRepresentation,
  ShowBase,
  useShowContext,
  useTranslate,
} from "ra-core";
import { EditButton } from "@/components/admin/edit-button";
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Card, CardContent } from "@/components/ui/card";

import type { Vaccination } from "../types";
import { AsideSection } from "../misc/AsideSection";
import { getExpiryStatus } from "./expiryStatus";

/**
 * Show page for a vaccination record.
 */
export const VaccinationShow = () => (
  <ShowBase>
    <VaccinationShowContent />
  </ShowBase>
);

const VaccinationShowContent = () => {
  const { record, isPending } = useShowContext<Vaccination>();
  const translate = useTranslate();

  if (isPending || !record) return null;

  const expiryStatus = getExpiryStatus(record.expires_on);

  return (
    <div className="mt-2 mb-2 flex gap-8">
      <div className="flex-1">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-semibold">{record.vaccine_name}</h5>
              <EditButton />
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.vaccinations.fields.administered_on")}
                </span>
                <div>
                  <DateField source="administered_on" />
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.vaccinations.fields.validity_months")}
                </span>
                <div>
                  <NumberField source="validity_months" />{" "}
                  {translate("resources.vaccinations.months")}
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  {translate("resources.vaccinations.fields.expires_on")}
                </span>
                <div className="flex items-center gap-2">
                  <DateField source="expires_on" />
                  <ExpiryBadge status={expiryStatus} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden sm:block w-72 min-w-72 text-sm">
        <AsideSection
          title={translate("resources.vaccinations.fields.animal_id")}
        >
          <ReferenceField reference="animals" source="animal_id" link="show">
            <RecordRepresentation />
          </ReferenceField>
        </AsideSection>
      </div>
    </div>
  );
};

/**
 * Small inline badge indicating whether a vaccination has expired,
 * is expiring soon (within 30 days), or is still valid.
 */
const ExpiryBadge = ({
  status,
}: {
  status: "expired" | "expiring_soon" | "valid";
}) => {
  const translate = useTranslate();
  const label = translate(`resources.vaccinations.expiry_status.${status}`);

  const classMap: Record<typeof status, string> = {
    expired: "bg-destructive/10 text-destructive",
    expiring_soon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    valid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classMap[status]}`}
    >
      {label}
    </span>
  );
};
