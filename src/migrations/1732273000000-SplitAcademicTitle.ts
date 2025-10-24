import { MigrationInterface, QueryRunner } from 'typeorm';

export class SplitAcademicTitle1732273000000 implements MigrationInterface {
  name = 'SplitAcademicTitle1732273000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "academic_degree_enum" AS ENUM (
        'ts', 'ths', 'cn', 'ks', 'ds', 'bs', 'tc', 'khac'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "academic_rank_enum" AS ENUM (
        'gs', 'pgs', 'none'
      )
    `);

    // Add new columns with enum types
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      ADD COLUMN "academicDegree" "academic_degree_enum",
      ADD COLUMN "academicRank" "academic_rank_enum"
    `);

    // Migrate existing data from academicTitle to new columns
    await queryRunner.query(`
      UPDATE "lecturers" 
      SET 
        "academicDegree" = CASE 
          WHEN "academicTitle" = 'TS' THEN 'ts'
          WHEN "academicTitle" = 'ThS' THEN 'ths'
          WHEN "academicTitle" = 'CN' THEN 'cn'
          WHEN "academicTitle" = 'KS' THEN 'ks'
          ELSE 'khac'
        END,
        "academicRank" = CASE 
          WHEN "academicTitle" = 'GS' THEN 'gs'
          WHEN "academicTitle" = 'PGS' THEN 'pgs'
          ELSE 'none'
        END
    `);

    // Drop old column
    await queryRunner.query(`
      ALTER TABLE "lecturers" DROP COLUMN "academicTitle"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back academicTitle column
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      ADD COLUMN "academicTitle" VARCHAR(100)
    `);

    // Migrate data back
    await queryRunner.query(`
      UPDATE "lecturers" 
      SET "academicTitle" = CASE 
        WHEN "academicDegree" = 'ts' THEN 'TS'
        WHEN "academicDegree" = 'ths' THEN 'ThS'
        WHEN "academicDegree" = 'cn' THEN 'CN'
        WHEN "academicDegree" = 'ks' THEN 'KS'
        ELSE 'CN'
      END
    `);

    // Drop new columns
    await queryRunner.query(`
      ALTER TABLE "lecturers" 
      DROP COLUMN "academicDegree",
      DROP COLUMN "academicRank"
    `);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "academic_degree_enum"`);
    await queryRunner.query(`DROP TYPE "academic_rank_enum"`);
  }
}
