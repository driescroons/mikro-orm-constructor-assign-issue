import {
  AssignOptions,
  BaseEntity,
  Cascade,
  Collection,
  Entity,
  EntityData,
  ManyToOne,
  MikroORM,
  OneToMany,
  Options,
  PrimaryKey,
  Property,
  RequestContext,
  wrap,
} from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { expect } from "chai";
import { v4 } from "uuid";

import ormConfig, { ormConfigFactory } from "../config";
import { OptionDTO } from "../dtos/option.dto";
import { QuestionDTO } from "../dtos/question.dto";

abstract class Base<T extends { id: string }> extends BaseEntity<T, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property({ defaultRaw: `now()` })
  public createdAt!: Date;

  @Property({ defaultRaw: `now()`, onUpdate: () => new Date() })
  public updatedAt!: Date;

  constructor(body?: { [P in keyof T]?: T[P] }) {
    super();
    // this.assign(body, { em: RequestContext.getEntityManager() });
  }

  public assign(data: EntityData<T>, options?: AssignOptions) {
    return super.assign(data, {
      ...options,
      updateNestedEntities: true,
    }) as T;
  }
}

@Entity()
class Question extends Base<Question> {
  @Property()
  public label!: string;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: [Cascade.ALL],
    mappedBy: "question",
  })
  public options: Collection<Option> = new Collection<Option>(this);

  constructor(body: QuestionDTO) {
    super(body as any as Question);
    this.assign(body, { em: RequestContext.getEntityManager() });
  }
}

@Entity()
class Option extends Base<Option> {
  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  public question: Question;

  @Property()
  public label!: string;

  constructor(body: OptionDTO) {
    super(body as unknown as Option);
    this.assign(body, { em: RequestContext.getEntityManager() });
  }
}

describe("Assign not in base test", () => {
  let orm: MikroORM<PostgreSqlDriver>;

  before(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>(
      ormConfigFactory([Option, Question]) as Options<PostgreSqlDriver>
    );
  });

  beforeEach(async () => {
    // clearing db with migrations
    await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    // running migrations
    const generator = orm.getSchemaGenerator();
    await generator.createSchema();
    await generator.updateSchema();
  });

  it("should create nested entities with assign not in base", async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const question = new Question({
        label: "question label",
        options: [
          {
            label: "option 1",
          },
          {
            label: "option 2",
          },
        ],
      });

      await orm.em.persistAndFlush(question);
      orm.em.clear();

      const fetchedQuestions = await orm.em.findOne(Question, {
        id: question.id,
      });

      expect(fetchedQuestions).to.not.be.null;
      await fetchedQuestions.options.init();
      expect(fetchedQuestions.options.getItems()).to.not.be.lengthOf(0);
    });
  });

  it("should update nested entities with assign not in base", async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const question = new Question({
        label: "question label",
        options: [
          {
            label: "option 1",
          },
          {
            label: "option 2",
          },
        ],
      });

      await orm.em.persistAndFlush(question);
      orm.em.clear();

      let fetchedQuestion = await orm.em.findOne(
        Question,
        {
          id: question.id,
        },
        ["options"]
      );

      let body = fetchedQuestion.toObject();
      const updatedLabel = "updated option 1";
      const updatedOptionId = body.options[0].id;
      body.options[0].label = updatedLabel;

      fetchedQuestion.assign(body);
      await orm.em.persistAndFlush(question);

      orm.em.clear();

      let fetchedOption = await orm.em.findOne(Option, {
        id: updatedOptionId,
      });

      body = fetchedOption.toObject();
      expect(body.label).to.be.equal(updatedLabel);
    });
  });
});
