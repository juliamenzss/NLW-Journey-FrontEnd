import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn,  } from "typeorm";

const { nanoid } = require('nanoid')

// essa classe vai representar o registro do user no banco de dados, quais propriedades tera e quais colunas terao
@Entity('users')
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    dateOfBirth: string;

    @CreateDateColumn({ type: 'datetime' })
    createAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updateAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = `user_${nanoid()}`;

    }
}
