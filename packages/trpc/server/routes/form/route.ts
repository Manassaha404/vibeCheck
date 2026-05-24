import { formServises } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import {  getAllCreatedFormsDto } from "@repo/services/form/model";
import { handleRouteError } from "../../utils/error";
import { zodUndefinedModel } from "../../schema";
import { createFormModel } from "./model";
export const formRouter = router({
  getAllCreatedForms: protectedProcedure
    .input(zodUndefinedModel)
    .query(async ({ ctx }) => {
      try {
        const { forms } =
          await formServises.getAllCreatedFormsWithToTalResponces({
            userId: ctx.user.id,
          });
        return { forms };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  createForm: protectedProcedure.input(createFormModel).mutation(async ({ ctx, input }) => {
    try {
      const { form } = await formServises.createForm({userId: ctx.user.id, ...input});
      return { form };
    } catch (error) {
      handleRouteError(error);
    }
  })
});

