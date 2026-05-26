import { trpc } from "./trpc/client";
const x: boolean = trpc.form.getAllCreatedForms.useQuery(undefined);
