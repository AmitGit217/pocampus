import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: true,
  })
  phone: string;

  @Prop({ type: String, minlength: 6, required: true })
  password: string;
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
