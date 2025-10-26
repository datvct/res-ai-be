import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddZaloAndMessageToLecturers1732400000000 implements MigrationInterface {
  name = 'AddZaloAndMessageToLecturers1732400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      ADD COLUMN "zalo" VARCHAR(255),
      ADD COLUMN "message" VARCHAR(255)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      DROP COLUMN "zalo",
      DROP COLUMN "message"
    `);
  }
}
