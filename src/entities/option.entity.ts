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
import { OptionDTO } from "../dtos/option.dto";
import { Base } from "./base.entity";
import Question from "./question.entity";

@Entity()
export default class Option extends Base<Option> {
  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  public question: Question;

  @Property()
  public label!: string;

  constructor(body: OptionDTO) {
    super(body as unknown as Option);
    wrap(this).assign(body, { em: RequestContext.getEntityManager() });
  }
}
