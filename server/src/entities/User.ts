import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Event } from "./Event";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  googleId!: string;

  @Column()
  displayName!: string;

  @Column()
  email!: string;

  @OneToMany(() => Event, (event) => event.user)
  events!: Event[];
}
