import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1755823168332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.user (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) NOT NULL,
            "username" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "password" VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            "deletedAt" TIMESTAMP WITH TIME ZONE,
            "tenantId" integer,
            CONSTRAINT "FK_user_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.user`);
  }
}
