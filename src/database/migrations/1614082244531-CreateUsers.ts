import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1614082244531 implements MigrationInterface {

    //--up-- para adicionar uma migration
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            })
        );
    }

    //--down-- para remover/largar uma migration
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    
    }

}
