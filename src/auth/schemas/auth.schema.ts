import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isEmail from 'validator/lib/isEmail';
import * as phone from 'phone-regex';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: [true, 'Name is required'],
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validate: [isEmail, 'Please enter a valid'],
  })
  email: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: [true, 'Phone is required'],
    validate: {
      validator: function (v: phone) {
        return /^((\+)33|0)[1-9](\d{2}){4}$/.test(v); //Phone regex validator, the type is for typescript from 3rd party library
      },
    },
  })
  phone: string;

  @Prop({
    type: String,
    minlength: 6,
    required: [true, 'Password is required'],
  })
  password: string;

  @Prop({ type: [String], default: [] })
  institutes: string[];

  @Prop({ type: [String], default: [] })
  majors: string[];

  //TODO: summaries: [Summary];
  // * The summaries array is need to be a validated array of type "Summary"
}
export const AuthSchema = SchemaFactory.createForClass(Auth);
