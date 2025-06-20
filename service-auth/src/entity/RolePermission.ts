import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class RolePermission {
    @PrimaryColumn()
    roleId!: number;

    @PrimaryColumn()
    permissionId!: number;
}
