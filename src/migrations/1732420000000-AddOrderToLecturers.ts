import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderToLecturers1732420000000 implements MigrationInterface {
  name = 'AddOrderToLecturers1732420000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      ADD COLUMN "order" INTEGER NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      DROP COLUMN "order"
    `);
  }
}
