import { Syringe } from "lucide-react";
import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";

import type { Vaccination } from "../types";

/**
 * Computes the ISO date string for today and today + 30 days.
 * Used to build the server-side range filter for upcoming vaccination expiries.
 */
function getThirtyDayWindow(): { today: string; in30Days: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(today.getDate() + 30);
  return {
    today: today.toISOString(),
    in30Days: in30Days.toISOString(),
  };
}

/**
 * Dashboard widget that lists vaccinations expiring within the next 30 days,
 * sorted by soonest expiry first.
 * Each row links through to the animal record.
 */
export const VaccinationsDueWidget = () => {
  const translate = useTranslate();
  const { today, in30Days } = getThirtyDayWindow();

  const { data: vaccinations, isPending } = useGetList<Vaccination>(
    "vaccinations",
    {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "expires_on", order: "ASC" },
      filter: {
        "expires_on@gte": today,
        "expires_on@lte": in30Days,
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <div className="mr-3 flex">
          <Syringe className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.dashboard.vaccinations_due.title")}
        </h2>
      </div>
      <Card className="py-0">
        <VaccinationsDueList
          vaccinations={vaccinations}
          isPending={isPending}
        />
      </Card>
    </div>
  );
};

const VaccinationsDueList = ({
  vaccinations,
  isPending,
}: {
  vaccinations: Vaccination[] | undefined;
  isPending: boolean;
}) => {
  const translate = useTranslate();

  if (isPending) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {translate("crm.common.loading")}
      </div>
    );
  }

  if (!vaccinations?.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {translate("crm.dashboard.vaccinations_due.empty")}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {vaccinations.map((vaccination) => (
        <VaccinationDueItem key={vaccination.id} vaccination={vaccination} />
      ))}
    </div>
  );
};

const VaccinationDueItem = ({ vaccination }: { vaccination: Vaccination }) => {
  const translate = useTranslate();
  const expiresDate = new Date(vaccination.expires_on).toLocaleDateString();

  return (
    <Link
      to={`/animals/${vaccination.animal_id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">
          {vaccination.animal_name ?? String(vaccination.animal_id)}
        </div>
        <div className="text-sm text-muted-foreground">
          {vaccination.vaccine_name}
        </div>
      </div>
      <div className="text-sm text-yellow-600 dark:text-yellow-400 ml-4 shrink-0">
        {translate("crm.dashboard.vaccinations_due.expires_on", {
          date: expiresDate,
        })}
      </div>
    </Link>
  );
};
