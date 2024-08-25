import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToMany
} from 'typeorm';
import {Role} from "../role/role.entity";
import {ParticipantEntity} from "../participant.entity";
import {UserQuestAnswer} from "./userQuestAnswer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  wallet_address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  modified_at: Date;

  @ManyToOne(() => Role, role => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => ParticipantEntity, participant => participant.user)
  participations: ParticipantEntity[];

  @OneToMany(() => UserQuestAnswer, userQuestAnswer => userQuestAnswer.user)
  questAnswers: UserQuestAnswer[];
}
