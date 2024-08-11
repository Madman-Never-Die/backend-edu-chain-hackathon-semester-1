import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { Question } from './question.entity';

// @Entity()
// export class Answer {
//   @PrimaryGeneratedColumn()
//   id: bigint;
//
//   @Column({ type: 'varchar', length: 255 })
//   content: string;
//
//   @ManyToOne(() => Question, (question) => question.answers)
//   question: Question;
// }

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'varchar', length: 255 })
  content: string;
}