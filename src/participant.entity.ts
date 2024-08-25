import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";
import {User} from "./users/user.entity";
import {Quest} from "./quests/quests.entity";

@Entity()
@Unique(['user', 'quest'])
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @ManyToOne(() => User, user => user.participations, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quest, quest => quest.participants, { nullable: false })
  @JoinColumn({ name: 'quest_id' })
  quest: Quest;

  @Column({ type: 'boolean', default: false })
  is_completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}