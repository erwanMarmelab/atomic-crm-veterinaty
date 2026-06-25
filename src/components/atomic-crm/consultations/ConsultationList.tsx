import { useListContext, useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { List } from "@/components/admin/list";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

import { TopToolbar } from "../layout/TopToolbar";
import type { Consultation } from "../types";

/**
 * List page for consultations. Shows all clinic visits.
 */
export const ConsultationList = () => (
  <List
    title={false}
    actions={<ConsultationListActions />}
    perPage={25}
    sort={{ field: "date", order: "DESC" }}
  >
    <ConsultationListLayout />
  </List>
);

const ConsultationListLayout = () => {
  const { isPending } = useListContext<Consultation>();
  if (isPending) return null;

  return (
    <Card className="py-0">
      <ConsultationListContent />
    </Card>
  );
};

const ConsultationListContent = () => {
  const { data: consultations, isPending } = useListContext<Consultation>();
  const translate = useTranslate();

  if (isPending) return null;

  if (!consultations?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {translate("resources.consultations.empty.title")}
      </div>
    );
  }

  return (
    <div className="md:divide-y">
      {consultations.map((consultation) => (
        <ConsultationListItem key={consultation.id} consultation={consultation} />
      ))}
    </div>
  );
};

const ConsultationListItem = ({
  consultation,
}: {
  consultation: Consultation;
}) => {
  const translate = useTranslate();
  const dateLabel = new Date(consultation.date).toLocaleDateString();

  return (
    <Link
      to={`/consultations/${consultation.id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">{dateLabel}</div>
        <div className="text-sm text-muted-foreground">{consultation.reason}</div>
      </div>
      {consultation.next_appointment && (
        <div className="text-sm text-muted-foreground ml-4">
          {translate("resources.consultations.fields.next_appointment")}:{" "}
          {new Date(consultation.next_appointment).toLocaleDateString()}
        </div>
      )}
    </Link>
  );
};

const ConsultationListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);
