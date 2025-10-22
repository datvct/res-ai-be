import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from 'typeorm';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Lecturer, (lecturer) => lecturer.keywords)
  lecturers: Lecturer[];
}
