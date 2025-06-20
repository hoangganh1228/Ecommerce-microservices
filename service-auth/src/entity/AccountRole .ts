import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class AccountRole {
    @PrimaryColumn()
    accountId!: number;

    @PrimaryColumn()
    roleId!: number;
}
