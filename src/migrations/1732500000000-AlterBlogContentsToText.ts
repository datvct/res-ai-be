import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterBlogContentsToText1732500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alter contents column to TEXT if it's not already TEXT
    await queryRunner.query(`
      ALTER TABLE blogs 
      ALTER COLUMN contents TYPE TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to VARCHAR(255) - not recommended but for rollback
    await queryRunner.query(`
      ALTER TABLE blogs 
      ALTER COLUMN contents TYPE VARCHAR(255);
    `);
  }
}
