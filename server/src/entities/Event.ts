import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  googleEventId!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  start!: string;

  @Column()
  end!: string;

  @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
  user!: User;
}
