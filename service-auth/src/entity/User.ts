import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    accountId!: number;

    @Column()
    fullName?: string;

    @Column()
    phone?: string;

    @Column()
    gender?: string;

    @Column({ type: 'datetime', nullable: true })
    birthday?: Date;

    @Column({ nullable: true })
    avatar?: string;

    @CreateDateColumn()
    createdAt!: Date;
}
