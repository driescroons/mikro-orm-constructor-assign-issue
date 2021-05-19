import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  RequestContext,
  wrap,
} from "@mikro-orm/core";
import { QuestionDTO } from "../dtos/question.dto";
import { Base } from "./base.entity";

import { Form } from "./form.entity";
import Option from "./option.entity";

@Entity()
export default class Question extends Base<Question> {
  @ManyToOne(() => Form, { onDelete: "CASCADE" })
  public form: Form;

  @Property()
  public label!: string;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: [Cascade.ALL],
    mappedBy: "question",
  })
  public options: Collection<Option> = new Collection<Option>(this);

  constructor(body: QuestionDTO) {
    super(body as any as Question);
    wrap(this).assign(body, { em: RequestContext.getEntityManager() });
  }
}
