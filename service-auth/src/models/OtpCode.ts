import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum OtpType {
    EMAIL = 'email',
    SMS = 'sms'
}

@Entity()
export class OtpCode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    accountId!: number;

    @Column()   
    otp!: string;

    @Column({
        type: 'enum',
        enum: OtpType
    })
    type!: OtpType;
    
    @Column()
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

}