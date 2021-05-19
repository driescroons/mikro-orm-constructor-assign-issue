import {
  BaseEntity,
  PrimaryKey,
  Property,
  RequestContext,
  EntityData,
  AssignOptions,
  wrap,
} from "@mikro-orm/core";
import { v4 } from "uuid";

export class Base<T extends { id: string }> extends BaseEntity<T, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property({ defaultRaw: `now()` })
  public createdAt!: Date;

  @Property({ defaultRaw: `now()`, onUpdate: () => new Date() })
  public updatedAt!: Date;

  constructor(body?: { [P in keyof T]?: T[P] }) {
    super();
    // I'd use the create method on the em here, but I have no access to the type, unless I pass it... (?)
    // Uncomment this: wrap(this).assign(body, { em: RequestContext.getEntityManager() });
  }

  public assign(data: EntityData<T>, options?: AssignOptions) {
    return super.assign(data, {
      ...options,
      updateNestedEntities: true,
    }) as T;
  }
}
