import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum OtpType {
    EMAIL = 'email',
    SMS = 'sms'
}

export enum OtpPurpose {
    RESET_PASSWORD = 'reset_password',
    VERIFY_ACCOUNT = 'verify_account',
    VERIFY_TRANSACTION = 'verify_transaction',
    TWO_FA = '2fa',
    OTHER = 'other',
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

    @Column({
        type: 'enum',
        enum: OtpPurpose,
        default: OtpPurpose.OTHER
    })
    purpose!: OtpPurpose;
    
    @Column()
    expiresAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

}