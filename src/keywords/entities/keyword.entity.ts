import { Lecturer } from '@/lecturers/entities/lecturer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Lecturer, (lecturer) => lecturer.keywords)
  lecturers: Lecturer[];
}
