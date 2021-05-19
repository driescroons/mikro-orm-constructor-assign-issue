import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  RequestContext,
  wrap,
} from "@mikro-orm/core";
import { FormDTO } from "../dtos/form.dto";
import { Base } from "./base.entity";
import Question from "./question.entity";

@Entity()
export class Form extends Base<Form> {
  @Property()
  public title!: string;

  @OneToMany(() => Question, (question) => question.form, {
    cascade: [Cascade.ALL],
    mappedBy: "form",
  })
  public questions = new Collection<Question>(this);

  constructor(body: FormDTO) {
    super(body as Form);

    wrap(this).assign(body, { em: RequestContext.getEntityManager() });
  }
}
