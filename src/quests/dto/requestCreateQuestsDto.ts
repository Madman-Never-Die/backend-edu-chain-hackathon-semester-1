export enum questsType {
  BLOCKCHAIN = 'blockchain',
  NETWORK = 'network',
  ETC = 'etc',
}

class CreateAnswerDto {
  content: string;
}

class CreateQuestionDto {
  // question: string;
  question: string;
  correctAnswer: number;
  answers: CreateAnswerDto[];
}

export class RequestCreateQuestsDto {
  liquidity_provider: string;
  provider: string;
  title: string;
  paper_url: string
  content: string;
  type: questsType;
  questions: CreateQuestionDto[];
}
