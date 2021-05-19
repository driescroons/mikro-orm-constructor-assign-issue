import { MikroORM, Options, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Form } from "../entities/form.entity";
import ormConfig from "../config";

import { expect } from "chai";
import Question from "../entities/question.entity";

describe("Sample test", () => {
  let orm;

  before(async () => {
    orm = await MikroORM.init<PostgreSqlDriver>(
      ormConfig as Options<PostgreSqlDriver>
    );
  });

  beforeEach(async () => {
    // clearing db with migrations
    await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    // running migrations
    const migrator = orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations.length > 0) {
      await migrator.up();
    }
  });

  it("should test something", async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const form = new Form({
        title: "Form title",
      });

      await orm.em.persistAndFlush(form);
      orm.em.clear();

      const fetchedForm = await orm.em.findOneOrFail(Form, { id: form.id });

      expect(fetchedForm).to.not.be.null;

      const question = new Question({
        form: form.id,
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

  it("should deeply add entities", async () => {
    await RequestContext.createAsync(orm.em, async () => {
      const form = new Form({
        title: "form label 2",
        questions: [
          {
            label: "question label 2",
            options: [
              {
                label: "option 1 2",
              },
              {
                label: "option 2 2",
              },
            ],
          },
        ],
      } as any);

      await orm.em.persistAndFlush(form);
    });
  });
});
