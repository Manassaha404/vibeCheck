import db, { count, eq, sql, and, asc, desc, gte, lte, inArray } from "@repo/database";
import {
  getAllCreatedFormsDto,
  getAllCreatedFormsType,
  createFormDto,
  createFormType,
  getFormByIdDto,
  getFormByIdType,
  addFormFieldsType,
  addFormFieldsDto,
  editFormTitleDescriptionVisibilityType,
  editFormTitleDescriptionVisibilityDto,
  getAnalyticsForSpecificFormType,
  getAnalyticsForSpecificFormDto,
  getFormResponsesType,
  getFormResponsesDto,
  submitFormResponseDto,
  submitFormResponseType,
  getFormDataForSubmitFormType,
  getFormDataForSubmitFormDto,
  formPasswordCheckType,
  formPasswordCheckDto,
  formActionWithGuestTokenType,
  formActionWithGuestTokenDto,
  updateFormResponseType,
  updateFormResponseDto,
  getFormResponsesForExportDto,
  getFormResponsesForExportType,
  getResponseByIdDto,
  getResponseByIdType,
  deleteFormDto,
  deleteFormType,
} from "./model";
import {
  answerTable,
  fieldTable,
  formTable,
  responseTable,
} from "@repo/database/schema";
import { AppError } from "@repo/error";

const RATING_COLORS: Record<number, string> = {
  1: "#EF4444",
  2: "#F97316",
  3: "#EAB308",
  4: "#84CC16",
  5: "#E2FF32",
};

const CHART_COLORS = [
  "#E2FF32",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#60A5FA",
  "#F472B6",
  "#2DD4BF",
  "#FBBF24",
];

class FormServices {

  private static getChartType(type: string) {
    if (["rating", "multi_select", "number"].includes(type)) {
      return "bar";
    }
    if (["single_select", "checkbox"].includes(type)) {
      return "pie";
    }
    return "text";
  }

  private static bucketNumbers(nums: number[]) {
    if (nums.length === 0) return [];
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    if (min === max) {
      return [{ name: String(min), value: nums.length }];
    }
    const BUCKETS = 5;
    const range = max - min;
    const step = range / BUCKETS;

    const buckets = Array.from({ length: BUCKETS }, (_, i) => {
      const low = Math.round(min + i * step);
      const high = Math.round(min + (i + 1) * step);
      return {
        name: i === BUCKETS - 1 ? `${low}+` : `${low}–${high}`,
        value: 0,
      };
    });

    for (const n of nums) {
      const idx = Math.min(
        Math.floor(((n - min) / range) * BUCKETS),
        BUCKETS - 1,
      );
      buckets[idx]!.value++;
    }
    return buckets;
  }

  private static parseChoiceValue(value: string): string[] {
    if (!value) return [];
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
      }
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String);
      return [String(parsed)];
    } catch {
    }

    return trimmed
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }





  public async getAllCreatedFormsWithToTalResponces(
    payload: getAllCreatedFormsType,
  ) {
    const { userId } = await getAllCreatedFormsDto.parseAsync(payload);

    const responsesCount = db.$with("responses_count").as(
      db
        .select({
          formId: responseTable.formId,
          count: count(responseTable.id).as("count"),
        })
        .from(responseTable)
        .groupBy(responseTable.formId),
    );

    const forms = await db
      .with(responsesCount)
      .select({
        id: formTable.id,
        title: formTable.title,
        slug: formTable.slug,
        description: formTable.description,
        visibility: formTable.visibility,
        isPublished: formTable.isPublished,
        allowResponseEdit: formTable.allowResponseEdit,
        responseLimit: formTable.responseLimit,
        expiresAt: formTable.expiresAt,
        createdAt: formTable.createdAt,
        updatedAt: formTable.updatedAt,
        totalResponses: sql<number>`COALESCE(${responsesCount.count}, 0)`.as(
          "totalResponses",
        ),
      })
      .from(formTable)
      .leftJoin(responsesCount, eq(formTable.id, responsesCount.formId))
      .where(eq(formTable.userId, userId));

    return { forms };
  }

  public async createForm(payload: createFormType) {
    const data = await createFormDto.parseAsync(payload);

    const [form] = await db
      .insert(formTable)
      .values({
        userId: data.userId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        visibility: data.visibility,
        isPublished: false,
        allowResponseEdit: data.allowResponseEdit,
        responseLimit: data.responseLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        passwordNeeded: data.passwordNeeded,
        password: data.passwordNeeded ? data.password : null,
      })
      .returning({
        id: formTable.id,
        slug: formTable.slug,
        title: formTable.title,
      });

    return { form };
  }

  public async getFormById(payload: getFormByIdType) {
    const data = await getFormByIdDto.parseAsync(payload);

    const [form] = await db
      .select()
      .from(formTable)
      .where(
        and(eq(formTable.id, data.formId), eq(formTable.userId, data.userId)),
      );

    if (!form) {
      throw new Error("Form not found");
    }

    return { form };
  }

  public async addFormFields(payload: addFormFieldsType) {
    const data = await addFormFieldsDto.parseAsync(payload);
    const insertData = data.fields.map((f) => ({ ...f, formId: data.formId }));
    const formFields = await db
      .insert(fieldTable)
      .values(insertData)
      .returning();

    return { formFields };
  }

  public async editFormTitleDescriptionVisibility(
    payload: editFormTitleDescriptionVisibilityType,
  ) {
    const data =
      await editFormTitleDescriptionVisibilityDto.parseAsync(payload);

    const [form] = await db
      .update(formTable)
      .set({
        title: data.title,
        description: data.description,
        visibility: data.visibility,
      })
      .where(eq(formTable.id, data.formId))
      .returning();
    return { form };
  }
  public async getAnalyticsForSpecificForm(
    payload: getAnalyticsForSpecificFormType,
  ) {
    const { formId } = await getAnalyticsForSpecificFormDto.parseAsync(payload);
    //formData
    const [form] = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, formId));
    if (!form) {
      throw new AppError("BAD_REQUEST", "Can't find the form!!");
    }
    const [responseSummary] = await db
      .select({
        totalResponses: count(responseTable.id),
        lastResponseAt: sql<Date | null>`MAX(${responseTable.createdAt})`,
      })
      .from(responseTable)
      .where(eq(responseTable.formId, form.id));

    const totalResponses = responseSummary?.totalResponses ?? 0;
    const lastResponseAt = responseSummary?.lastResponseAt ?? null;

    //trendData
    const rawTrendData = await db
      .select({
        date: sql<string>`DATE(${responseTable.createdAt})`.as("date"),
        responses: sql<number>`COUNT(*)`.as("responses"),
      })
      .from(responseTable)
      .where(eq(responseTable.formId, form.id))
      .groupBy(sql`DATE(${responseTable.createdAt})`)
      .orderBy(asc(sql`DATE(${responseTable.createdAt})`));

    const trendData = rawTrendData.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      responses: Number(d.responses),
    }));

    const avgResponsesPerDay =
      trendData.length > 0
        ? trendData.reduce((s, r) => s + r.responses, 0) / trendData.length
        : 0;

    //fieldsData
    const rawFields = await db
      .select()
      .from(fieldTable)
      .where(eq(fieldTable.formId, form.id));
    const fields = await Promise.all(
      rawFields.map(async (field) => {
        // find total responses per field
        const [answerCountRow] = await db
          .select({
            fieldResponseCount: count(answerTable.id),
          })
          .from(answerTable)
          .where(eq(answerTable.fieldId, field.id));

        const fieldTotalResponses = answerCountRow?.fieldResponseCount ?? 0;

        //handel rating field
        if (field.type === "rating") {
          const distribution = await db
            .select({
              value: answerTable.value,
              count: sql<number>`COUNT(*)`.as("count"),
            })
            .from(answerTable)
            .where(eq(answerTable.fieldId, field.id))
            .groupBy(answerTable.value)
            .orderBy(asc(answerTable.value));
          const chartData = distribution.map((d) => {
            return {
              name: d.value,
              value: Number(d.count),
              fill: RATING_COLORS[Number(d.value)] ?? "#E2FF32",
            };
          });
          const totalRatingSum = distribution.reduce(
            (s, r) => s + Number(r.value) * Number(r.count),
            0,
          );
          const totalRatingCount = distribution.reduce(
            (s, r) => s + Number(r.count),
            0,
          );
          const avgRating =
            totalRatingCount > 0
              ? Math.round((totalRatingSum / totalRatingCount) * 10) / 10
              : 0;
          return {
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required,
            totalResponses: fieldTotalResponses,
            chartType: FormServices.getChartType(field.type),
            chartData,
            avgRating,
          };
        }
        //handel number field
        if (field.type === "number") {
          const rawAnswers = await db
            .select({ value: answerTable.value })
            .from(answerTable)
            .where(eq(answerTable.fieldId, field.id));

          const nums = rawAnswers
            .map((r) => Number(r.value))
            .filter((n) => !isNaN(n));

          const avg =
            nums.length > 0
              ? Math.round(
                (nums.reduce((s, n) => s + n, 0) / nums.length) * 10,
              ) / 10
              : 0;
          const bucketChartData = FormServices.bucketNumbers(nums);
          return {
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required,
            totalResponses: fieldTotalResponses,
            chartType: FormServices.getChartType(field.type),
            chartData: bucketChartData,
            avg,
          };
        }

        if (
          ["single_select", "multi_select", "checkbox"].includes(field.type)
        ) {
          const rawAnswers = await db
            .select({ value: answerTable.value })
            .from(answerTable)
            .where(eq(answerTable.fieldId, field.id));
          const tally = new Map<string, number>();
          for (const row of rawAnswers) {
            const choices = FormServices.parseChoiceValue(row.value);
            for (const choice of choices) {
              tally.set(choice, (tally.get(choice) ?? 0) + 1);
            }
          }
          const chartData = Array.from(tally.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name, value], idx) => ({
              name,
              value,
              fill: CHART_COLORS[idx % CHART_COLORS.length],
            }));

          return {
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required,
            totalResponses: fieldTotalResponses,
            chartType: FormServices.getChartType(field.type),
            chartData,
          };
        }

        const recentRaw = await db
          .select({ value: answerTable.value })
          .from(answerTable)
          .where(eq(answerTable.fieldId, field.id))
          .orderBy(desc(answerTable.createdAt))
          .limit(10);

        const recentAnswers = recentRaw.map((r) => r.value);

        return {
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required,
          totalResponses: fieldTotalResponses,
          chartType: FormServices.getChartType(field.type),
          chartData: null,
          recentAnswers,
        };
      }),
    );

    return {
      form: {
        id: form.id,
        title: form.title,
        slug: form.slug,
        description: form.description ?? null,
        visibility: form.visibility,
        isPublished: form.isPublished,
        allowResponseEdit: form.allowResponseEdit,
        responseLimit: form.responseLimit ?? null,
        expiresAt: form.expiresAt ?? null,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt ?? null,
        totalResponses,
        avgResponsesPerDay: Math.round(avgResponsesPerDay * 10) / 10,
        lastResponseAt,
      },
      trendData,
      fields,
    };
  }

  public async getFormResponses(payload: getFormResponsesType) {
    const { formId, page, pageSize } =
      await getFormResponsesDto.parseAsync(payload);
    const offset = (page - 1) * pageSize;
    const responseRows = await db
      .select({
        id: responseTable.id,
        submittedAt: responseTable.createdAt,
      })
      .from(responseTable)
      .where(eq(responseTable.formId, formId))
      .orderBy(desc(responseTable.createdAt))
      .limit(pageSize)
      .offset(offset);

    return { responseRows };
  }



  public async getFormDataForSubmitForm(payload: getFormDataForSubmitFormType) {
    const { formId } = await getFormDataForSubmitFormDto.parseAsync(payload);
    const [form] = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, formId));
    if (!form) {
      throw new AppError("BAD_REQUEST", "Can't find the form!!");
    }
    const fields = await db
      .select()
      .from(fieldTable)
      .where(eq(fieldTable.formId, form.id));

    // Count current total responses to check against responseLimit
    let responseLimitReached = false;
    if (form.responseLimit !== null && form.responseLimit !== undefined) {
      const result = await db
        .select({ total: count(responseTable.id) })
        .from(responseTable)
        .where(eq(responseTable.formId, formId));
      const totalCount = result[0]?.total ?? 0;
      responseLimitReached = Number(totalCount) >= form.responseLimit;
    }

    return {
      id: form.id,
      title: form.title,
      description: form.description,
      passwordNeeded: form.passwordNeeded,
      allowResponseEdit: form.allowResponseEdit,
      responseLimit: form.responseLimit,
      responseLimitReached,
      fields: [...fields],
    };
  }

  public async formPasswordCheck(payload: formPasswordCheckType) {
    const { formId, password } = await formPasswordCheckDto.parseAsync(payload);
    const [form] = await db
      .select()
      .from(formTable)
      .where(eq(formTable.id, formId));
    if (!form) {
      throw new AppError("BAD_REQUEST", "Can't find the form!!");
    }
    if (form.password !== password.trim()) {
      return false;
    }
    return true;
  }

  public async submitFormResponse(payload: submitFormResponseType) {
    const { formId, answers, guestToken } =
      await submitFormResponseDto.parseAsync(payload);
    await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(responseTable)
        .values({
          formId,
          guestToken,
        })
        .returning();

      const insetValues = answers.map((a) => ({
        ...a,
        responseId: response?.id as string,
      }));
      if (insetValues.length > 0) {
        await tx.insert(answerTable).values(insetValues).returning();
      }
    });
    return { success: true, message: "Form submitted successfully" };
  }


  public async isAlreadySubmited(payload: formActionWithGuestTokenType) {
    const { formId, guestToken } = await formActionWithGuestTokenDto.parseAsync(payload);
    const [response] = await db
      .select()
      .from(responseTable)
      .where(and(eq(responseTable.formId, formId), eq(responseTable.guestToken, guestToken)));

    if (!response) {
      return { isSubmitted: false };
    }

    const answers = await db
      .select()
      .from(answerTable)
      .where(eq(answerTable.responseId, response.id));

    return {
      isSubmitted: true,
      answers: answers.map(a => ({ fieldId: a.fieldId, value: a.value }))
    };
  }

  public async deleteFormResponse(payload: formActionWithGuestTokenType) {
    const { formId, guestToken } = await formActionWithGuestTokenDto.parseAsync(payload);
    await db
      .delete(responseTable)
      .where(and(eq(responseTable.formId, formId), eq(responseTable.guestToken, guestToken)));

    return { success: true };
  }

  public async updateFormResponse(payload: updateFormResponseType) {
    const { formId, answers, guestToken } = await updateFormResponseDto.parseAsync(payload);

    await db.transaction(async (tx) => {
      const [existingResponse] = await tx
        .select()
        .from(responseTable)
        .where(and(eq(responseTable.formId, formId), eq(responseTable.guestToken, guestToken)));

      if (!existingResponse) {
        throw new AppError("BAD_REQUEST", "No existing response found to update.");
      }

      await tx.delete(answerTable).where(eq(answerTable.responseId, existingResponse.id));

      const insetValues = answers.map((a) => ({
        ...a,
        responseId: existingResponse.id,
      }));

      if (insetValues.length > 0) {
        await tx.insert(answerTable).values(insetValues);
      }
    });

    return { success: true, message: "Form response updated successfully" };
  }

  public async getFormResponsesForExport(payload: getFormResponsesForExportType) {
    const { formId, fieldIds, startDate, endDate } = await getFormResponsesForExportDto.parseAsync(payload);

    const allFields = await db
      .select()
      .from(fieldTable)
      .where(eq(fieldTable.formId, formId))
      .orderBy(asc(fieldTable.orderIndex));

    const exportFields = fieldIds?.length
      ? allFields.filter((f) => fieldIds.includes(f.id))
      : allFields;

    const formattedFields = exportFields.map(({ id, label, type }) => ({ id, label, type }));


    const conditions = [eq(responseTable.formId, formId)];
    if (startDate) conditions.push(gte(responseTable.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(responseTable.createdAt, new Date(endDate)));


    const responses = await db
      .select({ id: responseTable.id, submittedAt: responseTable.createdAt })
      .from(responseTable)
      .where(and(...conditions))
      .orderBy(asc(responseTable.createdAt));


    if (!responses.length) return { rows: [], fields: formattedFields };

    // 4. Fetch answers using `inArray` (Safer and much cleaner than sql.raw / ANY ARRAY)
    const responseIds = responses.map((r) => r.id);
    const allAnswers = await db
      .select({
        responseId: answerTable.responseId,
        fieldId: answerTable.fieldId,
        value: answerTable.value,
      })
      .from(answerTable)
      .where(inArray(answerTable.responseId, responseIds));

    const answersMap = allAnswers.reduce((acc, { responseId, fieldId, value }) => {
      acc[responseId] ??= {};
      acc[responseId][fieldId] = value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // 6. Build the flat row objects
    const rows = responses.map((r) => {
      const rowAnswers = answersMap[r.id] || {};

      const row: Record<string, string> = {
        "Response ID": r.id,
        "Submitted At": new Date(r.submittedAt).toISOString(),
      };

      for (const f of exportFields) {
        const rawVal = rowAnswers[f.id] || "";


        if (rawVal.startsWith("[")) {
          try {
            const parsed = JSON.parse(rawVal);
            row[f.label] = Array.isArray(parsed) ? parsed.join(", ") : rawVal;
            continue;
          } catch { }
        }
        row[f.label] = rawVal;
      }

      return row;
    });

    return { rows, fields: formattedFields };
  }

  public async getResponseById(payload: getResponseByIdType) {
    const { responseId, formId } = await getResponseByIdDto.parseAsync(payload);

    // Fetch the response itself
    const [response] = await db
      .select()
      .from(responseTable)
      .where(and(eq(responseTable.id, responseId), eq(responseTable.formId, formId)));

    if (!response) {
      throw new AppError("NOT_FOUND", "Response not found");
    }

    // Fetch all fields for this form (for labels)
    const fields = await db
      .select()
      .from(fieldTable)
      .where(eq(fieldTable.formId, formId))
      .orderBy(asc(fieldTable.orderIndex));

    // Fetch all answers for this response
    const answers = await db
      .select()
      .from(answerTable)
      .where(eq(answerTable.responseId, responseId));

    // Build field map for quick lookup
    const fieldMap = new Map(fields.map((f) => [f.id, f]));

    // Merge answers with field metadata
    const items = answers.map((answer) => {
      const field = fieldMap.get(answer.fieldId);
      // Pretty-print JSON array values
      let displayValue = answer.value;
      if (displayValue.trim().startsWith("[")) {
        try {
          const parsed = JSON.parse(displayValue);
          if (Array.isArray(parsed)) displayValue = parsed.join(", ");
        } catch { }
      }
      return {
        fieldId: answer.fieldId,
        fieldLabel: field?.label ?? "Unknown field",
        fieldType: field?.type ?? "short_text",
        value: displayValue,
      };
    });

    return {
      response: {
        id: response.id,
        submittedAt: response.createdAt,
      },
      items,
    };
  }

  public async deleteForm(payload: deleteFormType, userId: string) {
    const { id } = await deleteFormDto.parseAsync(payload);

    const [form] = await db
      .select()
      .from(formTable)
      .where(and(eq(formTable.id, id), eq(formTable.userId, userId)));

    if (!form) {
      throw new AppError("NOT_FOUND", "Form not found or you don't have permission to delete it");
    }

    await db.delete(formTable).where(eq(formTable.id, id));

    return { success: true };
  }
}

export default FormServices;
