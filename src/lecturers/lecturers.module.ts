import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { Lecturer } from './entities/lecturer.entity';
import { KeywordsModule } from '../keywords/keywords.module';
import { StorageProvider } from '../common/providers/storage.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer]), KeywordsModule],
  controllers: [LecturersController],
  providers: [LecturersService, StorageProvider],
  exports: [LecturersService],
})
export class LecturersModule {}
