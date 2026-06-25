import { ListBase, useListContext, useShowContext, useTranslate } from "ra-core";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

import type { Animal, Contact } from "../types";
import { AsideSection } from "../misc/AsideSection";

/**
 * Displays the list of animals owned by the current contact.
 * Shown in the contact show page aside (desktop).
 */
export const ContactAnimalsList = () => {
  const { record } = useShowContext<Contact>();
  const translate = useTranslate();

  if (!record) return null;

  return (
    <div className="hidden sm:block w-92 min-w-92 text-sm mt-0">
      <AsideSection
        title={translate("resources.animals.name", { smart_count: 2 })}
      >
        <ListBase
          resource="animals"
          filter={{ owner_id: record.id }}
          sort={{ field: "name", order: "ASC" }}
          perPage={50}
          disableSyncWithLocation
          storeKey={false}
        >
          <AnimalsListContent contactId={record.id} />
        </ListBase>
      </AsideSection>
    </div>
  );
};

const AnimalsListContent = ({
  contactId,
}: {
  contactId: number | string;
}) => {
  const { data: animals, isPending } = useListContext<Animal>();
  const translate = useTranslate();

  if (isPending) return null;

  return (
    <div className="flex flex-col gap-1">
      {animals?.map((animal) => (
        <Link
          key={animal.id}
          to={`/animals/${animal.id}/show`}
          className="hover:underline"
        >
          <span className="font-medium">{animal.name}</span>
          <span className="text-muted-foreground ml-1 text-xs">
            ({animal.species})
          </span>
        </Link>
      ))}
      {!animals?.length && (
        <span className="text-muted-foreground text-xs">
          {translate("resources.animals.empty.title")}
        </span>
      )}
      <div className="mt-2">
        <Link
          to={`/animals/create`}
          state={{ record: { owner_id: contactId } }}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Plus className="size-4" />
          {translate("resources.animals.action.add")}
        </Link>
      </div>
    </div>
  );
};
