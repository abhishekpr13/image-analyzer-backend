import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760929464524 implements MigrationInterface {
    name = 'InitialMigration1760929464524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying NOT NULL, "fileName" character varying NOT NULL, "filePath" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying NOT NULL, "uploadDate" TIMESTAMP NOT NULL DEFAULT now(), "analysisResult" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
