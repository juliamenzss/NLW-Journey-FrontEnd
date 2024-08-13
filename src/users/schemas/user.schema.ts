import { HydratedDocument, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/enums/role.enum";
import { Roles } from "src/decorators/roles.decorator";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document{

    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({ type: Number, enum: Role, default: (Role.User)  })
    role: Role;

    @Prop({ type: Date, default: Date.now })
    createAt: Date;

    @Prop({ type: Date, default: Date.now })
    updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);