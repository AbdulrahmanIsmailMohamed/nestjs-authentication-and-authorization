import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

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

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  ban: boolean;

  @Prop({ default: 0 })
  limit: number;

  @Prop()
  banDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
