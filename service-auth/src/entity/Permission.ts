import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description?: string;
}
