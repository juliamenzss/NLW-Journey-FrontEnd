// import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
// // import { ActivitiesStatus } from "../enum/activities-status.enum";
// // import { IsOptional } from "class-validator";

// const { nanoid } = require('nanoid')

// @Entity('activities')
// export class Activity {
//     @PrimaryColumn()
//     id: string;

//     @Column()
//     title: string;

//     @Column()
//     description: string;

//     @Column({
//         type: 'text',
//         default: 'PENDING',
//     })
//     status: string;

//     @CreateDateColumn({ type: 'datetime' })
//     createAt: Date;

//     @UpdateDateColumn({ type: 'datetime' })
//     updateAt: Date;

//     @BeforeInsert()
//     generateId() {
//         this.id = `task_${nanoid()}`;
//     }
// }
