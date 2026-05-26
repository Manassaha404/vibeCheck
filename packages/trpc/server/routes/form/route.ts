import { formServises } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  addFormFieldsDto,
  editFormTitleDescriptionVisibilityDto,
  formPasswordCheckDto,
  getAnalyticsForSpecificFormDto,
  getFormDataForSubmitFormDto,
  getFormResponsesDto,
  getFormResponsesForExportDto,
  getResponseByIdDto,
  deleteFormDto,
} from "@repo/services/form/model";
import { handleRouteError } from "../../utils/error";
import { zodUndefinedModel } from "../../schema";
import { createFormModel, getFormByIdModel, submitFormResponseWithoutGuestTokenDto, formActionDto, updateFormResponseWithoutGuestTokenDto } from "./model";
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
  createForm: protectedProcedure
    .input(createFormModel)
    .mutation(async ({ ctx, input }) => {
      try {
        const { form } = await formServises.createForm({
          userId: ctx.user.id,
          ...input,
        });
        return { form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getFormById: protectedProcedure
    .input(getFormByIdModel)
    .query(async ({ ctx, input }) => {
      try {
        const { form } = await formServises.getFormById({
          userId: ctx.user.id,
          formId: input.id,
        });
        return { form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  addFormFields: protectedProcedure
    .input(addFormFieldsDto)
    .mutation(async ({ input }) => {
      try {
        const { formFields } = await formServises.addFormFields(input);
        return { formFields };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  editFormTitleDescriptionVisibility: protectedProcedure
    .input(editFormTitleDescriptionVisibilityDto)
    .mutation(async ({ input }) => {
      try {
        const { form } =
          await formServises.editFormTitleDescriptionVisibility(input);
        return { form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getAnalyticsForSpecificForm: protectedProcedure
    .input(getAnalyticsForSpecificFormDto)
    .query(async ({ input }) => {
      try {
        const { form, fields, trendData } =
          await formServises.getAnalyticsForSpecificForm(input);
        return {
          form,
          fields,
          trendData,
        };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getFormResponses: protectedProcedure.input(getFormResponsesDto).query(async ({ input }) => {
    try {
      const { responseRows } = await formServises.getFormResponses(input);
      return {
        responses: responseRows,
      }
    } catch (error) {
      handleRouteError(error)
    }
  }),

  submitFormResponse: publicProcedure.input(submitFormResponseWithoutGuestTokenDto).mutation(async ({ input, ctx }) => {
    try {
      return await formServises.submitFormResponse({ ...input, guestToken: ctx.guestToken });
    } catch (error) {
      handleRouteError(error)
    }
  }),
  getFormDataForSubmitForm: publicProcedure.input(getFormDataForSubmitFormDto).query(async ({ input }) => {
    const data = await formServises.getFormDataForSubmitForm(input);
    return { ...data };
  }),

  checkFormPassword: publicProcedure.input(formPasswordCheckDto).query(async ({ input }) => {
    const data = await formServises.formPasswordCheck(input);
    return data
  }),

  isAlreadySubmited: publicProcedure.input(formActionDto).query(async ({ input, ctx }) => {
    try {
      return await formServises.isAlreadySubmited({ ...input, guestToken: ctx.guestToken });
    } catch (error) {
      handleRouteError(error)
    }
  }),

  deleteFormResponse: publicProcedure.input(formActionDto).mutation(async ({ input, ctx }) => {
    try {
      return await formServises.deleteFormResponse({ ...input, guestToken: ctx.guestToken });
    } catch (error) {
      handleRouteError(error)
    }
  }),

  updateFormResponse: publicProcedure.input(updateFormResponseWithoutGuestTokenDto).mutation(async ({ input, ctx }) => {
    try {
      return await formServises.updateFormResponse({ ...input, guestToken: ctx.guestToken });
    } catch (error) {
      handleRouteError(error)
    }
  }),

  getFormResponsesForExport: protectedProcedure.input(getFormResponsesForExportDto).query(async ({ input }) => {
    try {
      return await formServises.getFormResponsesForExport(input);
    } catch (error) {
      handleRouteError(error);
    }
  }),

  getResponseById: protectedProcedure.input(getResponseByIdDto).query(async ({ input }) => {
    try {
      return await formServises.getResponseById(input);
    } catch (error) {
      handleRouteError(error);
    }
  }),

  deleteForm: protectedProcedure.input(deleteFormDto).mutation(async({ctx, input}) => {
    try {
      return await formServises.deleteForm(input, ctx.user.id);
    } catch (error) {
      handleRouteError(error);
    }
  }),
});
