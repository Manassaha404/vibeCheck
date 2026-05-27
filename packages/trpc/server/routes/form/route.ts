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
import {
  createFormModel,
  getFormByIdModel,
  submitFormResponseWithoutGuestTokenDto,
  formActionDto,
  updateFormResponseWithoutGuestTokenDto,
  formSchema,
  messageSchema,
} from "./model";
import { z } from "zod";
import { OpenApiMeta } from "trpc-to-openapi";



const createFormOpenApiMeta = (
  method: "GET" | "POST" | "DELETE",
  path: string,
  summary: string,
  description: string,
  protect?: boolean
): { openapi: NonNullable<OpenApiMeta["openapi"]> } => ({
  openapi: {
    method,
    path: `/forms${path}`,
    tags: ["form"],
    summary,
    description,
    ...(protect && { protect }),
  },
});



export const formRouter = router({
  getAllCreatedForms: protectedProcedure
    .meta(
      createFormOpenApiMeta(
        "GET",
        "",
        "Get all forms created by the current user",
        "Returns all forms owned by the authenticated user, with total response counts.",
        true
      )
    )
    .input(zodUndefinedModel)
    .output(z.object({ forms: z.array(z.any()) }))
    .query(async ({ ctx }) => {
      try {
        const { forms } =
          await formServises.getAllCreatedFormsWithToTalResponces({
            userId: ctx.user.id,
          });
        return { forms };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  getAllPublicForms: publicProcedure
    .meta(
      createFormOpenApiMeta(
        "GET",
        "/public",
        "Get all public forms",
        "Returns all publicly visible forms."
      )
    )
    .input(zodUndefinedModel)
    .output(z.object({ forms: z.array(z.any()) }))
    .query(async () => {
      try {
        const { forms } = await formServises.getAllPublicForms();
        return { forms };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  createForm: protectedProcedure
    .meta(
      createFormOpenApiMeta(
        "POST",
        "",
        "Create a new form",
        "Creates a new form for the authenticated user.",
        true
      )
    )
    .input(createFormModel)
    .output(z.object({ form: z.any() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { form } = await formServises.createForm({
          userId: ctx.user.id,
          ...input,
        });
        return { form };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  getFormById: protectedProcedure
    .meta(
      createFormOpenApiMeta(
        "GET",
        "/{id}",
        "Get a form by ID (owned)",
        "Returns a specific form by its ID, validating that it belongs to the current user.",
        true
      )
    )
    .input(getFormByIdModel)
    .output(z.object({ form: z.any() }))
    .query(async ({ ctx, input }) => {
      try {
        const { form } = await formServises.getFormById({
          userId: ctx.user.id,
          formId: input.id,
        });
        return { form };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  addFormFields: protectedProcedure
    .input(addFormFieldsDto)
    .mutation(async ({ input }) => {
      try {
        const { formFields } = await formServises.addFormFields(input);
        return { formFields };
      } catch (error) {
        return handleRouteError(error);
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
        return handleRouteError(error);
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
        return handleRouteError(error);
      }
    }),

  getFormResponses: protectedProcedure
    .input(getFormResponsesDto)
    .query(async ({ input }) => {
      try {
        const { responseRows } = await formServises.getFormResponses(input);
        return {
          responses: responseRows,
        };
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  submitFormResponse: publicProcedure
    .meta(
      createFormOpenApiMeta(
        "POST",
        "/submit",
        "Submit a response to a form",
        "Submits answers for a public form (formId + answers in request body). A guest token cookie is automatically managed."
      )
    )
    .input(submitFormResponseWithoutGuestTokenDto)
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServises.submitFormResponse({
          ...input,
          guestToken: ctx.guestToken,
        });
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  getFormDataForSubmitForm: publicProcedure
    .meta(
      createFormOpenApiMeta(
        "GET",
        "/submit",
        "Get form data for submission view",
        "Returns the form fields and metadata needed to render the public submission page. Pass formId as query parameter."
      )
    )
    .input(getFormDataForSubmitFormDto)
    .output(z.any())
    .query(async ({ input }) => {
      const data = await formServises.getFormDataForSubmitForm(input);
      return { ...data };
    }),

  checkFormPassword: publicProcedure
    .meta(
      createFormOpenApiMeta(
        "GET",
        "/check-password",
        "Check if a form password is correct",
        "Validates a user-supplied password against a password-protected form. Pass formId and password as query parameters."
      )
    )
    .input(formPasswordCheckDto)
    .output(z.any())
    .query(async ({ input }) => {
      const data = await formServises.formPasswordCheck(input);
      return data;
    }),

  isAlreadySubmited: publicProcedure
    .input(formActionDto)
    .query(async ({ input, ctx }) => {
      try {
        return await formServises.isAlreadySubmited({
          ...input,
          guestToken: ctx.guestToken,
        });
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  deleteFormResponse: publicProcedure
    .input(formActionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServises.deleteFormResponse({
          ...input,
          guestToken: ctx.guestToken,
        });
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  updateFormResponse: publicProcedure
    .input(updateFormResponseWithoutGuestTokenDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServises.updateFormResponse({
          ...input,
          guestToken: ctx.guestToken,
        });
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  getFormResponsesForExport: protectedProcedure
    .input(getFormResponsesForExportDto)
    .query(async ({ input }) => {
      try {
        return await formServises.getFormResponsesForExport(input);
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  getResponseById: protectedProcedure
    .input(getResponseByIdDto)
    .query(async ({ input }) => {
      try {
        return await formServises.getResponseById(input);
      } catch (error) {
        return handleRouteError(error);
      }
    }),

  deleteForm: protectedProcedure
    .meta(
      createFormOpenApiMeta(
        "DELETE",
        "/{id}",
        "Delete a form",
        "Permanently deletes a form owned by the authenticated user.",
        true
      )
    )
    .input(deleteFormDto)
    .output(z.any())
    .mutation(async ({ ctx, input }) => {
      try {
        return await formServises.deleteForm(input, ctx.user.id);
      } catch (error) {
        return handleRouteError(error);
      }
    }),
});
