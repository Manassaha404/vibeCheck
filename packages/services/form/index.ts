import db, { count, eq, sql } from "@repo/database";
import { getAllCreatedFormsDto, getAllCreatedFormsType } from "./model";
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
}
export default FormServices;
