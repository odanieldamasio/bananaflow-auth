import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsTable1755817822751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.tenant (
            "id" SERIAL PRIMARY KEY,
            "slug" VARCHAR(255) NOT NULL UNIQUE,
            "name" VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            "deletedAt" TIMESTAMP WITH TIME ZONE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.tenant
    `);
  }
}
