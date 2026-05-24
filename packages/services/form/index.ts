import db, { count, eq, sql } from "@repo/database";
import { getAllCreatedFormsDto, getAllCreatedFormsType, createFormDto, createFormType } from "./model";
import { formTable, responseTable } from "@repo/database/schema";

class FormServices {
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

        totalResponses: sql<number>`
      COALESCE(${responsesCount.count}, 0)
    `.as("totalResponses"),
      })
      .from(formTable)
      .leftJoin(responsesCount, eq(formTable.id, responsesCount.formId))
      .where(eq(formTable.userId, userId));

    return {forms};
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
}
export default FormServices;
