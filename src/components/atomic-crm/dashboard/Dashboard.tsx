import { useGetList } from "ra-core";

import type { Contact, ContactNote } from "../types";
import { AppointmentsThisWeekWidget } from "./AppointmentsThisWeekWidget";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { UpcomingConsultationsWidget } from "./UpcomingConsultationsWidget";
import { VaccinationsDueWidget } from "./VaccinationsDueWidget";
import { Welcome } from "./Welcome";

export const Dashboard = () => {
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const isPending = isPendingContact || isPendingContactNotes;

  if (isPending) {
    return null;
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-1">
      <div className="md:col-span-4">
        <div className="flex flex-col gap-6">
          {import.meta.env.VITE_IS_DEMO === "true" ? <Welcome /> : null}
          <VaccinationsDueWidget />
          <AppointmentsThisWeekWidget />
          <UpcomingConsultationsWidget />
        </div>
      </div>
      <div className="md:col-span-8">
        <DashboardActivityLog />
      </div>
    </div>
  );
};
