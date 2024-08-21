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

  @OneToMany(() => Question, (question) => question.quest, { cascade: true })
  questions: Question[];
}