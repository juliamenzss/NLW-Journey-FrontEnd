import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";


export type ActivityDocument = HydratedDocument<Activity>


@Schema()
export class Activity {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop({ enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' })
    status?: string;

    @Prop({ type: Date, default: Date.now })
    createAt: Date;

    @Prop({ type: Date, default: Date.now })
    updateAt: Date

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

}

export const ActivitySchema = SchemaFactory.createForClass(Activity)