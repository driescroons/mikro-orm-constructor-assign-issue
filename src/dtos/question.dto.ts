import { OptionDTO } from "./option.dto";

export interface QuestionDTO {
  form?: string;
  label: string;
  options: OptionDTO[];
}
