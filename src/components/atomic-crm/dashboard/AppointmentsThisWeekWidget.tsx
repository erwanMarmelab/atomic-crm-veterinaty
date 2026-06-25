import { CalendarDays } from "lucide-react";
import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";

import type { Consultation } from "../types";

/**
 * Computes the start (Monday 00:00) and end (Sunday 23:59:59) of the current ISO week.
 */
function getCurrentWeekBounds(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, …
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
  };
}

/**
 * Dashboard widget that lists consultations whose next_appointment falls within
 * the current calendar week (Mon–Sun), sorted by soonest appointment first.
 * Each row links through to the consultation record.
 */
export const AppointmentsThisWeekWidget = () => {
  const translate = useTranslate();
  const { weekStart, weekEnd } = getCurrentWeekBounds();

  const { data: consultations, isPending } = useGetList<Consultation>(
    "consultations",
    {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "next_appointment", order: "ASC" },
      filter: {
        "next_appointment@gte": weekStart,
        "next_appointment@lte": weekEnd,
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <div className="mr-3 flex">
          <CalendarDays className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.dashboard.appointments_this_week.title")}
        </h2>
      </div>
      <Card className="py-0">
        <AppointmentsList
          consultations={consultations}
          isPending={isPending}
        />
      </Card>
    </div>
  );
};

const AppointmentsList = ({
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
        {translate("crm.dashboard.appointments_this_week.empty")}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {consultations.map((consultation) => (
        <AppointmentItem key={consultation.id} consultation={consultation} />
      ))}
    </div>
  );
};

const AppointmentItem = ({
  consultation,
}: {
  consultation: Consultation;
}) => {
  const translate = useTranslate();
  const appointmentDate = new Date(
    consultation.next_appointment!,
  ).toLocaleDateString();

  return (
    <Link
      to={`/consultations/${consultation.id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">
          {consultation.animal_name ?? String(consultation.animal_id)}
        </div>
        <div className="text-sm text-muted-foreground">
          {consultation.reason}
        </div>
      </div>
      <div className="text-sm text-primary ml-4 shrink-0">
        {translate("crm.dashboard.appointments_this_week.appointment_on", {
          date: appointmentDate,
        })}
      </div>
    </Link>
  );
};
