import { OptionDTO } from "./option.dto";

export interface QuestionDTO {
  label: string;
  options: OptionDTO[];
}
