import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KeywordsModule } from './keywords/keywords.module';
import { PublicationsModule } from './publications/publications.module';
import { LecturersModule } from './lecturers/lecturers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    KeywordsModule,
    PublicationsModule,
    LecturersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
