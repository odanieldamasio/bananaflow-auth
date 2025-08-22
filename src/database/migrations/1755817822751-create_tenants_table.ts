import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsTable1755817822751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public."tenant" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "slug" VARCHAR(255) NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS public."tenant" CASCADE
    `);
  }
}
