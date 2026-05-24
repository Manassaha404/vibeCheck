import { formServises } from "../../services";
import { protectedProcedure, router } from "../../trpc";
import {  addFormFieldsDto, editFormTitleDescriptionVisibilityDto, getAllCreatedFormsDto } from "@repo/services/form/model";
import { handleRouteError } from "../../utils/error";
import { zodUndefinedModel } from "../../schema";
import { createFormModel, getFormByIdModel } from "./model";
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
  }),
  getFormById: protectedProcedure.input(getFormByIdModel).query(async ({ ctx, input }) => {
    try {
      const { form } = await formServises.getFormById({ userId: ctx.user.id, formId: input.id });
      return { form };
    } catch (error) {
      handleRouteError(error);
    }
  }),
  addFormFields: protectedProcedure.input(addFormFieldsDto).mutation(async ({ input }) => {
    try {
      const { formFields } = await formServises.addFormFields(input);
      return { formFields };
    } catch (error) {
      handleRouteError(error);
    }
  }),
  editFormTitleDescriptionVisibility: protectedProcedure.input(editFormTitleDescriptionVisibilityDto).mutation(async ({ input }) => {
    try {
      const { form } = await formServises.editFormTitleDescriptionVisibility(input);
      return { form };
    } catch (error) {
      handleRouteError(error);
    }
  }),
});

