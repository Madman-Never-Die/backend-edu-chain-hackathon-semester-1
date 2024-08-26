import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import {questsType} from "./dto/requestCreateQuestsDto";
import {ParticipantEntity} from "../participant.entity";
import {UserQuestAnswer} from "../users/userQuestAnswer";

@Entity()
export class Quest {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({ type: 'varchar', length: 50 })
  liquidity_provider: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  provider: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @Column({ type: 'varchar', length: 200 })
  type: string;

  @Column({ type: 'bigint', default: 0, transformer: { to: (value) => value, from: (value) => Number(value) } })
  participation: number;

  @Column({ default: 'Active' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  end_date: Date;

  @Column({ type: 'bigint', default: 0, nullable: false })
  likes: number;
  @OneToMany(() => Question, (question) => question.quest, { cascade: true })
  questions: Question[];

  @OneToMany(() => ParticipantEntity, participant => participant.quest, { cascade: true })
  participants: ParticipantEntity[];

  @OneToMany(() => UserQuestAnswer, userQuestAnswer => userQuestAnswer.quest, { cascade: true })
  userAnswers: UserQuestAnswer[];
}