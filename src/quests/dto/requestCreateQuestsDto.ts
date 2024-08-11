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
  liquidity_provider: string;  // 여기서 필드명을 데이터베이스 필드명과 일치시킴
  provider: string;
  title: string;
  content: string;
  type: questsType;
  questions: CreateQuestionDto[];
}
