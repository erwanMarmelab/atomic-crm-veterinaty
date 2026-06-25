import { CalendarClock } from "lucide-react";
import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";

import type { Consultation } from "../types";

/**
 * Dashboard widget that lists consultations whose next_appointment is in the
 * future, sorted by soonest appointment first.
 * Each row links through to the consultation record.
 */
export const UpcomingConsultationsWidget = () => {
  const translate = useTranslate();
  const now = new Date().toISOString();

  const { data: consultations, isPending } = useGetList<Consultation>(
    "consultations",
    {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "next_appointment", order: "ASC" },
      filter: {
        "next_appointment@gte": now,
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <div className="mr-3 flex">
          <CalendarClock className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.dashboard.upcoming_consultations.title")}
        </h2>
      </div>
      <Card className="py-0">
        <UpcomingConsultationsList
          consultations={consultations}
          isPending={isPending}
        />
      </Card>
    </div>
  );
};

const UpcomingConsultationsList = ({
  consultations,
  isPending,
}: {
  consultations: Consultation[] | undefined;
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

  if (!consultations?.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        {translate("crm.dashboard.upcoming_consultations.empty")}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {consultations.map((consultation) => (
        <UpcomingConsultationItem
          key={consultation.id}
          consultation={consultation}
        />
      ))}
    </div>
  );
};

const UpcomingConsultationItem = ({
  consultation,
}: {
  consultation: Consultation;
}) => {
  const translate = useTranslate();
  const appointmentDate = new Date(
    consultation.next_appointment!,
  ).toLocaleDateString();

  const ownerName =
    consultation.owner_first_name || consultation.owner_last_name
      ? `${consultation.owner_first_name ?? ""} ${consultation.owner_last_name ?? ""}`.trim()
      : null;

  return (
    <Link
      to={`/consultations/${consultation.id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">
          {consultation.animal_name ?? String(consultation.animal_id)}
        </div>
        {ownerName && (
          <div className="text-sm text-muted-foreground">{ownerName}</div>
        )}
      </div>
      <div className="text-sm text-primary ml-4 shrink-0">
        {translate("crm.dashboard.upcoming_consultations.appointment_on", {
          date: appointmentDate,
        })}
      </div>
    </Link>
  );
};
