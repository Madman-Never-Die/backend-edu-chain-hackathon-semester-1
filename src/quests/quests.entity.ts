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

// @Entity()
// export class Quests {
//   @PrimaryGeneratedColumn()
//   id: bigint;
//
//   @Column({ type: 'varchar', length: 50 })
//   liquidityProvider: string;
//
//   @Column({ type: 'varchar', length: 50 })
//   provider: string;
//
//   @CreateDateColumn()
//   createdAt: Date;
//
//   @UpdateDateColumn()
//   modifiedAt: Date;
//
//   @Column({ type: 'varchar', length: 50 })
//   title: string;
//
//   @Column({ type: 'varchar', length: 255 })
//   content: string;
//
//   @Column({ type: 'enum', enum: questsType })
//   type: questsType;
//
//   @OneToMany(() => Question, (question) => question.quest, { cascade: true })
//   questions: Question[];
// }

@Entity()
export class Quests {
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

  @OneToMany(() => Question, (question) => question.quest, { cascade: true })
  questions: Question[];
}