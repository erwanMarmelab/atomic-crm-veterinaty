import { useListContext, useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { List } from "@/components/admin/list";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

import { TopToolbar } from "../layout/TopToolbar";
import type { Vaccination } from "../types";
import { getExpiryStatus } from "./expiryStatus";

/**
 * List page for vaccinations. Shows all vaccination records across animals.
 */
export const VaccinationList = () => (
  <List
    title={false}
    actions={<VaccinationListActions />}
    perPage={25}
    sort={{ field: "administered_on", order: "DESC" }}
  >
    <VaccinationListLayout />
  </List>
);

const VaccinationListLayout = () => {
  const { isPending } = useListContext<Vaccination>();
  if (isPending) return null;

  return (
    <Card className="py-0">
      <VaccinationListContent />
    </Card>
  );
};

const VaccinationListContent = () => {
  const { data: vaccinations, isPending } = useListContext<Vaccination>();
  const translate = useTranslate();

  if (isPending) return null;

  if (!vaccinations?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {translate("resources.vaccinations.empty.title")}
      </div>
    );
  }

  return (
    <div className="md:divide-y">
      {vaccinations.map((vaccination) => (
        <VaccinationListItem key={vaccination.id} vaccination={vaccination} />
      ))}
    </div>
  );
};

const VaccinationListItem = ({
  vaccination,
}: {
  vaccination: Vaccination;
}) => {
  const translate = useTranslate();
  const expiryStatus = getExpiryStatus(vaccination.expires_on);
  const statusLabel = translate(
    `resources.vaccinations.expiry_status.${expiryStatus}`,
  );

  const statusClassMap: Record<typeof expiryStatus, string> = {
    expired: "text-destructive",
    expiring_soon: "text-yellow-600 dark:text-yellow-400",
    valid: "text-green-600 dark:text-green-400",
  };

  return (
    <Link
      to={`/vaccinations/${vaccination.id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">{vaccination.vaccine_name}</div>
        {vaccination.animal_name && (
          <div className="text-sm font-medium text-foreground">
            {vaccination.animal_name}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          {translate("resources.vaccinations.fields.administered_on")}:{" "}
          {new Date(vaccination.administered_on).toLocaleDateString()}
        </div>
      </div>
      <div className={`text-sm ml-4 font-medium ${statusClassMap[expiryStatus]}`}>
        {statusLabel}
      </div>
    </Link>
  );
};

const VaccinationListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);
