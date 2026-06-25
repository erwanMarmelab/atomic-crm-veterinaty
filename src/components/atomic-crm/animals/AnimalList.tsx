import { useListContext, useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

import { TopToolbar } from "../layout/TopToolbar";
import type { Animal } from "../types";

const animalFilters = [<SearchInput source="q" alwaysOn />];

/**
 * List page for animals. Shows all animal patients.
 */
export const AnimalList = () => (
  <List
    title={false}
    actions={<AnimalListActions />}
    filters={animalFilters}
    perPage={25}
    sort={{ field: "name", order: "ASC" }}
  >
    <AnimalListLayout />
  </List>
);

const AnimalListLayout = () => {
  const { isPending } = useListContext<Animal>();

  if (isPending) return null;

  return (
    <Card className="py-0">
      <AnimalListContent />
    </Card>
  );
};

const AnimalListContent = () => {
  const { data: animals, isPending } = useListContext<Animal>();
  const translate = useTranslate();

  if (isPending) return null;

  if (!animals?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {translate("resources.animals.empty.title")}
      </div>
    );
  }

  return (
    <div className="md:divide-y">
      {animals.map((animal) => (
        <AnimalListItem key={animal.id} animal={animal} />
      ))}
    </div>
  );
};

const AnimalListItem = ({ animal }: { animal: Animal }) => {
  const translate = useTranslate();
  return (
    <Link
      to={`/animals/${animal.id}/show`}
      className="flex flex-row items-center px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium">{animal.name}</div>
        <div className="text-sm text-muted-foreground">
          {animal.species}
          {animal.breed ? ` — ${animal.breed}` : ""}
        </div>
      </div>
      <div className="text-sm text-muted-foreground ml-4">
        {translate(`resources.animals.status.${animal.status}`)}
      </div>
    </Link>
  );
};

const AnimalListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);
