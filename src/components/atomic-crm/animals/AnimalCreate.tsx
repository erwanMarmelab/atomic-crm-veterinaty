import { CreateBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { AnimalInputs } from "./AnimalInputs";
import { FormToolbar } from "../layout/FormToolbar";

/**
 * Create page for a new animal patient.
 */
export const AnimalCreate = () => (
  <CreateBase redirect="show">
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form defaultValues={{ status: "active" }}>
          <Card>
            <CardContent>
              <AnimalInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  </CreateBase>
);
