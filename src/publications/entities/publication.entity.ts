import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lecturer } from '../../lecturers/entities/lecturer.entity';

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  publicationYear: number;

  @Column({ nullable: true })
  journal: string;

  @Column({ type: 'text', nullable: true })
  authors: string;

  @Column({ nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: ['research_paper', 'project', 'book', 'conference', 'other'],
    default: 'research_paper',
  })
  type: string;

  @Column('uuid')
  lecturerId: string;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.publications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lecturerId' })
  lecturer: Lecturer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
