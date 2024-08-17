export interface QuestDto {
  id: bigint;
  title: string;
  content: string;
  type: string;
  liquidityProvider: string;
  provider: string;
  createdAt: Date;
  modifiedAt: Date;
  questions: QuestionDto[];
}

export interface QuestionDto {
  id: bigint;
  question: string;
  correctAnswer: number;
  answers: AnswerDto[];
}

export interface AnswerDto {
  id: bigint;
  content: string;
  correctAnswer: boolean;
}
