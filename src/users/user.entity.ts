import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pw: string;

  @Column()
  name: string;

  @Column()
  age: number;
}
