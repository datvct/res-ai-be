import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { AcademicDegree } from '../enums/academic-degree.enum';
import { AcademicRank } from '../enums/academic-rank.enum';

@Entity('lecturers')
export class Lecturer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: AcademicDegree,
    nullable: true,
  })
  academicDegree: AcademicDegree;

  @Column({
    type: 'enum',
    enum: AcademicRank,
    nullable: true,
  })
  academicRank: AcademicRank;

  @Column()
  workUnit: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  website: string;

  @ManyToMany(() => Keyword, (keyword) => keyword.lecturers, {
    cascade: true,
    eager: false,
  })
  @JoinTable({
    name: 'lecturer_keywords',
    joinColumn: { name: 'lecturerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'keywordId', referencedColumnName: 'id' },
  })
  keywords: Keyword[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
