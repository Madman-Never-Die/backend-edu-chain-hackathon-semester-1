import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Quest } from '../quests/quests.entity';
import { Question } from '../quests/question.entity';

@Entity()
export class UserQuestAnswer {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => User, user => user.questAnswers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quest, quest => quest.userAnswers)
  @JoinColumn({ name: 'quest_id' })
  quest: Quest;

  @ManyToOne(() => Question, question => question.userAnswers)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'boolean' })
  is_correct: boolean;

  @Column('text')
  answer_content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
