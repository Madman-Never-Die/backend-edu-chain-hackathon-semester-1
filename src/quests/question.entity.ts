import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { Quest } from './quests.entity';
import { Answer } from './answer.entity';

// @Entity()
// export class Question {
//   @PrimaryGeneratedColumn()
//   id: bigint;
//
//   @Column({ type: 'varchar', length: 255 })
//   question: string;
//
//   @Column({ type: 'int' })
//   correctAnswer: number;
//
//   @ManyToOne(() => Quest, (quest) => quest.questions)
//   quest: Quest;
//
//   @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
//   answers: Answer[];
// }

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({ type: 'int' })
  correct_answer: number;

  @ManyToOne(() => Quest, (quest) => quest.questions)
  @JoinColumn({ name: 'quests_id' })
  quest: Quest;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];
}