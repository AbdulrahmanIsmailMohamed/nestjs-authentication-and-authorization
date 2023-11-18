import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Role from 'src/common/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  country: string;

  @Prop({ default: Role.USER })
  roles: Role;

  @Prop({ default: false })
  ban: boolean;

  @Prop({ default: 0 })
  limit: number;

  @Prop()
  banDate: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
