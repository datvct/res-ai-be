import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AcademicTitle } from '../enums/academic-title.enum';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { Publication } from '../../publications/entities/publication.entity';

@Entity('lecturers')
export class Lecturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: AcademicTitle,
  })
  academicTitle: AcademicTitle;

  @Column({ type: 'int' })
  birthYear: number;

  @Column()
  workUnit: string;

  @Column()
  position: string;

  @Column({ type: 'text' })
  teachingField: string;

  @Column({ type: 'text' })
  researchField: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @ManyToMany(() => Keyword, (keyword) => keyword.lecturers, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'lecturer_keywords',
    joinColumn: { name: 'lecturerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'keywordId', referencedColumnName: 'id' },
  })
  keywords: Keyword[];

  @OneToMany(() => Publication, (publication) => publication.lecturer, {
    cascade: true,
  })
  publications: Publication[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
