import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('files')
export class File {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    originalName!: string;

    @Column()
    fileName!: string;

    @Column()
    filePath!: string;

    @Column()
    fileSize!: number;

    @Column()
    mimeType!: string;

    @CreateDateColumn()
    uploadDate!: Date;

    @Column({ nullable: true })
    analysisResult?: string;

    @Column()
    userId!: string;

    @ManyToOne(() => User, user => user.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;
}
