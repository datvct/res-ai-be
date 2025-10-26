import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNCSToAcademicDegreeEnum1732410000000 implements MigrationInterface {
  name = 'AddNCSToAcademicDegreeEnum1732410000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'ncs' value to the academic_degree_enum
    // Note: This will fail if 'ncs' already exists, so check first
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum 
          WHERE enumlabel = 'ncs' 
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'academic_degree_enum')
        ) THEN
          ALTER TYPE "academic_degree_enum" ADD VALUE 'ncs';
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: PostgreSQL doesn't support removing enum values directly
    await queryRunner.query(`
      -- Enum value removal is not supported in PostgreSQL
      -- Would need to drop and recreate the entire type
    `);
  }
}
