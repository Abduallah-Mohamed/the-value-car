import { Report } from 'src/reports/report.entity';
import {
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  //? wrap Report entity in a function to avoid circular dependency
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user:', this);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user:', this);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user:', this);
  }
}
