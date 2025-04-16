import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class ConfigNotification {
  @Prop({ default: 0 })
  AppID: number;

  @Prop({ default: 0 })
  CategoryID: number;

}

export const ConfigNotificationSchema = SchemaFactory.createForClass(ConfigNotification);

@Schema()
export class CustomData {
  @Prop({ type: [ConfigNotificationSchema], default: [] })
  configNotification: ConfigNotification[];

  @Prop({ default: [] })
  TagList: string[];

  @Prop({ default: 0 })
  RelevanceLevel: number;
}

export const CustomDataSchema = SchemaFactory.createForClass(CustomData);

@Schema()
export class User {
  @Prop({ type: CustomDataSchema })
  customData: CustomData;

  @Prop([String])
  refreshToken: string[];

  @Prop()
  disabled: boolean;

  @Prop()
  createdDate: Date;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  versionAPP: string | null;

  @Prop()
  incorrectLoginAttempts: number;

  @Prop()
  lockUntil: Date | null;

  @Prop()
  status: string;

  @Prop()
  secret2FA: string;
}

export const UserSchema = SchemaFactory.createForClass(User);